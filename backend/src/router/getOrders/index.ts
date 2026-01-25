import { TRPCError } from '@trpc/server'

import { trpc } from '../../lib/trpc'

export const getOrdersTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  if (ctx.me?.role !== 'ADMIN') {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const orders = await ctx.prisma.order.findMany({
    select: {
      customerName: true,
      createdAt: true,
      items: {
        select: {
          plantInstance: {
            select: {
              plant: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      status: true,
      id: true,
    },
  })

  return { orders }
})
