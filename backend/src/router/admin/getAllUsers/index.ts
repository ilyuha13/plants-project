import { adminProcedure } from '../../../lib/trpc'

export const getAllUsersTrpcRoute = adminProcedure.query(async ({ ctx }) => {
  // Получаем всех пользователей
  const users = await ctx.prisma.user.findMany({
    include: {
      _count: { select: { orders: true } },
      cart: {
        include: {
          items: {
            include: {
              plantInstance: {
                include: {
                  plant: true,
                },
              },
            },
          },
        },
      },
      // cart: {
      //   select: {
      //     id: true,
      //     reservationType: true,
      //     reservedUntil: true,
      //     requestedAt: true,
      //     prepaidAmount: true,
      //     items: {
      //       include: {
      //         plantInstance: {
      //           select: { price: true },
      //           include: {
      //             plant: { select: { name: true } },
      //           },
      //         },
      //       },
      //     },
      //   },
      //},
    },
    orderBy: { createdAt: 'desc' },
  })

  return users
})
