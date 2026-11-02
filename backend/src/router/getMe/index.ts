import _ from 'lodash'

import { publicProcedure } from '../../lib/trpc'

export const getMeTrpcRoute = publicProcedure.query(async ({ ctx }) => {
  const user = ctx.me
    ? await ctx.prisma.user.findUnique({ where: { id: ctx.me.id } })
    : null
  return {
    me:
      user &&
      _.pick(user, [
        'id',
        'nick',
        'role',
        'customerName',
        'customerFirstName',
        'customerLastName',
        'customerPatronymic',
        'customerContact',
        'customerPhone',
        'customerTelegram',
        'customerVk',
        'reservationComment',
        'deliveryType',
        'deliveryAddress',
        'pickupPoint',
        'deliveryNotes',
      ]),
  }
})
