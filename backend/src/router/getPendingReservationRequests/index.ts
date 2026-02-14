import { adminProcedure } from '../../lib/trpc'

export const getPendingReservationRequestsTrpcRoute = adminProcedure.query(
  async ({ ctx }) => {
    const count = await ctx.prisma.cart.count({
      where: {
        reservationType: 'RESERVED_PREPAID_REQUEST',
      },
    })
    return { count }
  },
)
