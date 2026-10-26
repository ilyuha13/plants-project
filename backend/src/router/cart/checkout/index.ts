import { TRPCError } from '@trpc/server'

import { checkoutInput } from './input'
import {
  deliveryNeedsAddress,
  deliveryNeedsPickupPoint,
} from '../../../lib/deliveryOptions'
import { sendTelegramMessage } from '../../../lib/telegram'
import { protectedProcedure } from '../../../lib/trpc'

export const checkoutTrpcRoute = protectedProcedure
  .input(checkoutInput)
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.$transaction(async (tx) => {
      await tx.cart.updateMany({
        where: { userId: ctx.me.id },
        data: { updatedAt: new Date() },
      })
      const cart = await tx.cart.findUnique({
        where: { userId: ctx.me.id },
        include: { items: true },
      })
      if (!cart?.items.length) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Корзина пуста' })
      }
      if (cart.purchaseRequestedAt) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Заявка на покупку уже отправлена',
        })
      }
      if (
        cart.reservationType === 'AUTOMATIC' &&
        cart.reservedUntil &&
        cart.reservedUntil < new Date()
      ) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Срок автоброни истёк' })
      }
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          purchaseRequestedAt: new Date(),
          requestedAt: cart.requestedAt || new Date(),
          reservationType:
            cart.reservationType === 'AUTOMATIC'
              ? 'RESERVED_PREPAID_REQUEST'
              : cart.reservationType,
          reservedUntil: cart.reservationType === 'AUTOMATIC' ? null : cart.reservedUntil,
          customerName: input.contactInfo.name,
          customerContact: input.contactInfo.telegram || input.contactInfo.phone,
          customerPhone: input.contactInfo.phone,
          deliveryType: input.deliveryType,
          deliveryAddress: deliveryNeedsAddress(input.deliveryType)
            ? input.deliveryAddress
            : '',
          pickupPoint: deliveryNeedsPickupPoint(input.deliveryType)
            ? input.pickupPoint
            : '',
          deliveryNotes: input.deliveryNotes,
        },
      })
    })
    await sendTelegramMessage(
      'Новая заявка на покупку. Согласуйте состав, доставку и оплату в разделе «Бронирования» в админке.',
    )
    return { success: true }
  })
