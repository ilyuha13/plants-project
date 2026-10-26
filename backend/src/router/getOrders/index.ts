import { z } from 'zod'

import { orderStatuses } from '../../lib/orderProcessing'
import { adminProcedure } from '../../lib/trpc'

export const getOrdersTrpcRoute = adminProcedure
  .input(
    z
      .object({ filter: z.enum(['ACTIVE', 'ALL', ...orderStatuses]).default('ACTIVE') })
      .optional(),
  )
  .query(async ({ ctx, input }) => {
    const filter = input?.filter || 'ACTIVE'
    const orders = await ctx.prisma.order.findMany({
      where:
        filter === 'ALL'
          ? {}
          : filter === 'ACTIVE'
            ? { status: { in: ['COLLECTING', 'PACKED', 'SHIPPED'] } }
            : { status: filter },
      select: {
        id: true,
        customerName: true,
        customerContact: true,
        createdAt: true,
        status: true,
        totalAmount: true,
        deliveryType: true,
        trackingNumber: true,
      },
      orderBy: filter === 'ACTIVE' ? { createdAt: 'asc' } : { createdAt: 'desc' },
    })
    return { orders }
  })
