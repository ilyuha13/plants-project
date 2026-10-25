import { CronJob } from 'cron'

import { logger } from './logger'

import type { AppContext } from './ctx'

export const clearExpiredAutomaticCarts = async (
  ctx: Pick<AppContext, 'prisma'>,
  now = new Date(),
) => {
  const carts = await ctx.prisma.cart.findMany({
    where: { reservationType: 'AUTOMATIC', reservedUntil: { lt: now } },
    select: { id: true },
  })
  for (const { id } of carts) {
    await ctx.prisma.$transaction(async (tx) => {
      // Recheck and lock: a reservation request may have arrived after the initial scan.
      const claimed = await tx.cart.updateMany({
        where: { id, reservationType: 'AUTOMATIC', reservedUntil: { lt: now } },
        data: { reservedUntil: null },
      })
      if (!claimed.count) {
        return
      }
      const items = await tx.cartItem.findMany({ where: { cartId: id } })
      await tx.cartItem.deleteMany({ where: { cartId: id } })
      await tx.plantInstance.updateMany({
        where: {
          id: { in: items.map((item) => item.plantInstanceId) },
          status: 'IN_CART',
          cartItems: { none: {} },
          orderItems: { none: { order: { status: { not: 'CANCELLED' } } } },
        },
        data: { status: 'AVAILABLE' },
      })
    })
  }
}

export const applyClearCartCronJobs = (ctx: AppContext) => {
  new CronJob(
    '*/1 * * * *',
    async () => {
      try {
        await clearExpiredAutomaticCarts(ctx)
      } catch (error) {
        logger.error('cleanCarts', 'Ошибка очистки часовых корзин', {
          error: String(error),
        })
      }
    },
    null,
    true,
    'Europe/Moscow',
  )
}
