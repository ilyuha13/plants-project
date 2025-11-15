import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import { AppContext, createAppContext } from './lib/ctx'
import { env } from './lib/env'
import { applyPassportToExpressApp } from './lib/pasport'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'

void (async () => {
  let ctx: AppContext | null = null
  try {
    ctx = createAppContext()
    const expressApp = express()
    expressApp.use((req, res, next) => {
      // eslint-disable-next-line no-console
      console.log(`${req.method} ${req.url}`) // Log the HTTP method and URL
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

    const server = expressApp.listen(env.PORT, () => {
      console.info(`Listening at http://localhost:${env.PORT}`)
    })

    // Graceful shutdown handler
    const shutdown = (signal: string) => {
      console.info(`${signal} received, starting graceful shutdown...`)

      // Stop accepting new connections
      server.close(() => {
        console.info('HTTP server closed')

        // Close database connections and cleanup
        ctx
          ?.stop()
          .then(() => {
            console.info('Database connections closed')
            process.exit(0)
          })
          .catch((error) => {
            console.error('Error during shutdown:', error)
            process.exit(1)
          })
      })

      // Force shutdown after 30 seconds if graceful shutdown fails
      setTimeout(() => {
        console.error('Graceful shutdown timeout, forcing exit')
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
    console.error(error)
    await ctx?.stop()
    process.exit(1)
  }
})()
