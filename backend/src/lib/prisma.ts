import { PrismaClient } from '@prisma/client'

import { env } from './env'
import { logger } from './logger'

export const createPrismaClient = () => {
  const prisma = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'info' },
    ],
  })

  prisma.$on('query', (e) => {
    logger.info('prisma:low:query', 'Successfull request', {
      query: e.query,
      params: env.HOST_ENV === 'local' ? e.params : '***',
      duration: e.duration,
    })
  })

  prisma.$on('info', (e) => {
    logger.info('prisma:low:info', e.message)
  })

  const extendedPrisma = prisma.$extends({
    client: {},
    query: {
      $allModels: {
        $allOperations: async ({ model, operation, args, query }) => {
          const start = Date.now()
          try {
            const result = await query(args)
            const duration = Date.now() - start
            logger.info('prisma:hight', 'Successfull request', {
              model,
              operation,
              args,
              duration,
            })
            return result
          } catch (error) {
            const duration = Date.now() - start
            logger.error('prisma:hight:error', error, {
              model,
              operation,
              args,
              duration,
            })
            throw error
          }
        },
      },
    },
  })
  return extendedPrisma
}
