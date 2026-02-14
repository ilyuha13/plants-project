import { initTRPC, TRPCError } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { type Express } from 'express'
import superjson from 'superjson'
import { expressHandler } from 'trpc-playground/handlers/express'

import { TrpcRouter } from '../router'
import { AppContext } from './ctx'
import { logger } from './logger'
import { ExpressRequest } from '../utils/types'

const getCreateTrpcContext =
  (appContext: AppContext) =>
  ({ req }: trpcExpress.CreateExpressContextOptions) => ({
    ...appContext,
    me: (req as ExpressRequest).user || null,
  })

type TrpcContext = Awaited<ReturnType<typeof getCreateTrpcContext>>
const trpc = initTRPC.context<TrpcContext>().create({ transformer: superjson })
export const createTrpcRouter = trpc.router

const trpcLoggedProcedure = trpc.middleware(
  async ({ ctx, next, path, type, getRawInput }) => {
    const start = Date.now()
    const result = await next()
    const duration = Date.now() - start
    const meta = {
      path,
      type,
      userId: ctx.me?.id || null,
      input: await getRawInput(),
      duration,
    }
    if (result.ok) {
      logger.info(`trpc:${type}:success`, 'successful request', {
        ...meta,
        output: result.data,
      })
    } else {
      logger.error(`trpc${type}:error`, result.error, meta)
    }
    return result
  },
)

export const publicProcedure = trpc.procedure.use(trpcLoggedProcedure)
export const protectedProcedure = trpc.procedure
  .use(trpcLoggedProcedure)
  .use(({ ctx, next }) => {
    if (!ctx.me) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Необходима авторизация' })
    }
    return next({
      ctx: {
        ...ctx,
        me: ctx.me,
      },
    })
  })
export const adminProcedure = trpc.procedure
  .use(trpcLoggedProcedure)
  .use(({ ctx, next }) => {
    if (ctx.me?.role !== 'ADMIN') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Требуется роль администратора' })
    }
    return next({
      ctx: {
        ...ctx,
        me: ctx.me,
      },
    })
  })

export const applyTrpcToExpressApp = async (
  expressApp: Express,
  appContext: AppContext,
  trpcRouter: TrpcRouter,
) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: getCreateTrpcContext(appContext),
    }),
  )

  expressApp.use(
    '/trpc-playground',
    await expressHandler({
      trpcApiEndpoint: '/trpc',
      playgroundEndpoint: '/trpc-playground',
      router: trpcRouter,
      request: {
        superjson: true,
      },
    }),
  )
}
