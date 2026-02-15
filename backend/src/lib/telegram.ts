import { env } from './env'
import { logger } from './logger'

export async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_ADMIN_CHAT_ID) {
    logger.error(
      'Telegram',
      'Telegram credentials not configured. Skipping notification.',
    )
    return false
  }

  try {
    const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      logger.error('Telegram', `Telegram API error: ${error}`)
      return false
    }

    return true
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error('Telegram', `Failed to send Telegram message: ${errorMessage}`)
    return false
  }
}

/**
 * Форматирует сообщение о новом заказе
 */
export function formatCheckoutOrderMessage(order: {
  orderId: string
  customerName: string
  customerPhone: string
  customerTelegram?: string
  items: { name: string; price: string }[]
  total: number
  prepaidAmount?: number
}): string {
  const itemsList = order.items
    .map((item) => `  • ${item.name} - ${item.price}₽`)
    .join('\n')

  const hasPrepaid = order.prepaidAmount && order.prepaidAmount > 0
  const remaining =
    hasPrepaid && order.prepaidAmount ? order.total - order.prepaidAmount : order.total

  return `
🌱 <b>Новый заказ #${order.orderId}</b>

👤 <b>Клиент:</b>
   Имя: ${order.customerName}
   📱 Телефон: ${order.customerPhone}${order.customerTelegram ? `\n   💬 Telegram: @${order.customerTelegram}` : ''}

📦 <b>Товары:</b>
${itemsList}

💰 <b>Итого: ${order.total}₽</b>${hasPrepaid ? `\n✅ <b>Внесена предоплата: ${order.prepaidAmount}₽</b>\n💵 <b>К оплате: ${remaining}₽</b>` : ''}

<a href="${env.FRONTEND_URL}${`/order/${order.orderId}`}">Перейти к заказу</a>
  `.trim()
}

export const formatReservationRequestMessage = (
  type: 'prepaid' | 'no-prepaid',
  request: {
    cartId: string
    userId: string
    customerName: string
    customerPhone: string
    customerTelegram?: string
  },
) => {
  return `
⏳ <b>Запрос на бронирование ${type === 'prepaid' ? 'с предоплатой' : 'без предоплаты'}</b>

👤 <b>Клиент:</b>
   Имя: ${request.customerName} (${request.userId})
   📱 Телефон: ${request.customerPhone}${request.customerTelegram ? `\n   💬 Telegram: @${request.customerTelegram}` : ''}
${type === 'prepaid' ? `\n   ⚠️ Требуется подтверждение предоплаты в админке` : ''}
     
   `.trim()
}
