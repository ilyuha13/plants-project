import { TRPCError } from '@trpc/server'

import { zRequestPasswordResetInput } from './input'
import { sendTelegramMessage } from '../../lib/telegram'
import { trpc } from '../../lib/trpc'

// Это PUBLIC роут - пользователь не авторизован (забыл пароль)
export const requestPasswordResetTrpcRoute = trpc.procedure
  .input(zRequestPasswordResetInput)
  .mutation(async ({ ctx, input }) => {
    // Проверяем что пользователь с таким ником существует
    const user = await ctx.prisma.user.findUnique({
      where: { nick: input.nick },
      select: {
        id: true,
        nick: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Пользователь с таким никнеймом не найден',
      })
    }

    // Формируем сообщение для админа в Telegram
    const message = `
🔐 <b>Запрос на сброс пароля</b>

👤 <b>Пользователь:</b> ${user.nick}
🆔 <b>ID:</b> ${user.id}
👔 <b>Роль:</b> ${user.role === 'ADMIN' ? 'Админ' : 'Пользователь'}
📅 <b>Зарегистрирован:</b> ${new Date(user.createdAt).toLocaleDateString('ru-RU')}

📞 <b>Контактные данные:</b>
${input.contactInfo}

💡 <i>Свяжитесь с пользователем и сгенерируйте ссылку для сброса пароля в админ-панели</i>
    `.trim()

    // Отправляем сообщение в Telegram
    const sent = await sendTelegramMessage(message)

    if (!sent) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Не удалось отправить запрос администратору. Попробуйте позже или свяжитесь с нами напрямую.',
      })
    }

    return {
      success: true,
      message: 'Запрос отправлен администратору. Мы свяжемся с вами в ближайшее время по указанным контактным данным.',
    }
  })
