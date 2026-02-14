import { CronJob } from 'cron'

import { logger } from './logger'

import type { AppContext } from './ctx'

export const applyClearCartCronJobs = (ctx: AppContext) => {
  new CronJob(
    '*/1 * * * *',
    async () => {
      const startTime = new Date()
      const expiredCarts = await ctx.prisma.cart.findMany({
        where: {
          reservedUntil: { lt: startTime },
        },
        include: {
          items: true,
        },
      })
      if (!expiredCarts || expiredCarts.length === 0) {
        return
      }
      let successCount = 0
      let errorCount = 0
      for (const cart of expiredCarts) {
        const plantInstanceIds = cart.items.map((item) => item.plantInstanceId)
        try {
          await ctx.prisma.plantInstance.updateMany({
            where: {
              id: {
                in: plantInstanceIds,
              },
            },
            data: {
              status: 'AVAILABLE',
            },
          })
          await ctx.prisma.$transaction(async (tx) => {
            await tx.cartItem.deleteMany({
              where: { cartId: cart.id },
            })
            await tx.cart.update({
              where: {
                id: cart.id,
              },
              data: {
                reservationType: 'AUTOMATIC',
                reservedUntil: null,
              },
            })
          })
        } catch (error) {
          errorCount++
          logger.error('cleanCarts', 'Ошибка при очистке истекшей корзины', {
            cartId: cart.id,
            error: String(error),
          })
          continue
        }

        successCount++
      }

      logger.info('cleanCarts', 'Очистка истекших корзин выполнена', {
        successCount,
        errorCount,
        totalCount: expiredCarts.length,
      })
    },
    null,
    true,
    'Europe/Moscow',
  )
}
