import { PrismaClient } from '@prisma/client'

export async function getCart({ userId }: { userId: string }, prisma: PrismaClient) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  })

  if (!cart) {
    return { id: null, items: [] }
  }

  return cart
}
