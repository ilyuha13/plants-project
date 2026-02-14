import './lib/loadEnv.js'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import { applyClearCartCronJobs } from './lib/cron'
import { AppContext, createAppContext } from './lib/ctx'
import { env } from './lib/env'
import { logger } from './lib/logger'
import { applyPassportToExpressApp } from './lib/pasport'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'

void (async () => {
  let ctx: AppContext | null = null
  try {
    ctx = createAppContext()
    const expressApp = express()
    expressApp.use((req, res, next) => {
      logger.info('http', `${req.method} ${req.path}`, {
        method: req.method,
        path: req.path,
        query: req.query,
      })
      next()
    })
    expressApp.use(helmet())
    expressApp.use(
      cors({
        origin: [
          'http://localhost:8000', // Для разработки
          'https://www.greenflagplants.ru', // Production frontend
          'https://greenflagplants.ru', // Редирект на www (но на всякий случай)
        ],
        credentials: true, // Для cookies (JWT токен)
      }),
    )
    expressApp.use(express.static('public'))

    expressApp.get('/ping', (req, res) => {
      res.send('pong')
    })

    applyPassportToExpressApp(expressApp, ctx)
    await applyTrpcToExpressApp(expressApp, ctx, trpcRouter)
    applyClearCartCronJobs(ctx)

    expressApp.use(
      (
        err: unknown,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        logger.error('express', err)
        if (res.headersSent) {
          next(err)
          return
        }
        res.status(500).json({ error: 'Internal Server Error' })
      },
    )

    const server = expressApp.listen(env.PORT, () => {
      logger.info('express', `Listening at http://localhost:${env.PORT}`)
    })

    // Graceful shutdown handler
    const shutdown = (signal: string) => {
      logger.info(
        'GracefulShutdownHandler',
        `${signal} received, starting graceful shutdown...`,
      )

      // Stop accepting new connections
      server.close(() => {
        logger.info('GracefulShutdownHandler', 'HTTP server closed')
        // Close database connections and cleanup
        ctx
          ?.stop()
          .then(() => {
            logger.info('GracefulShutdownHandler', 'Database connections closed')
            process.exit(0)
          })
          .catch((error) => {
            logger.error('GracefulShutdownHandler', error, {
              message: 'Error during shutdown:',
            })
            process.exit(1)
          })
      })

      // Force shutdown after 30 seconds if graceful shutdown fails
      setTimeout(() => {
        logger.error('GracefulShutdownHandler', 'Graceful shutdown timeout, forcing exit')
        process.exit(1)
      }, 30000)
    }

    // Listen for termination signals
    process.on('SIGTERM', () => {
      shutdown('SIGTERM')
    })
    process.on('SIGINT', () => {
      shutdown('SIGINT')
    })
  } catch (error) {
    logger.error('app', error)
    await ctx?.stop()
    process.exit(1)
  }
})()
