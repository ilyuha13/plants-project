import { adminProcedure } from '../../lib/trpc'

export const getPendingReservationRequestsTrpcRoute = adminProcedure.query(
  async ({ ctx }) => {
    const now = new Date()
    const count = await ctx.prisma.cart.count({
      where: {
        OR: [
          { reservationType: 'RESERVED_PREPAID_REQUEST' },
          {
            reservationType: 'RESERVED_PREPAID_CONFIRMED',
            OR: [{ reviewAt: { lte: now } }, { reservedUntil: { lte: now } }],
          },
        ],
      },
    })
    return { count }
  },
)
