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

    expressApp.listen(env.PORT, () => {
      console.info(`Listening at http://localhost:${env.PORT}`)
    })
  } catch (error) {
    console.error(error)
    await ctx?.stop()
  }
})()
