/**
 * Утилита для отправки сообщений в Telegram
 */

import { logger } from '../utils/logger'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID

export async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
    logger.warn('Telegram credentials not configured. Skipping notification.')
    return false
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      logger.error(`Telegram API error: ${error}`)
      return false
    }

    return true
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to send Telegram message: ${errorMessage}`)
    return false
  }
}

/**
 * Форматирует сообщение о новом заказе
 */
export function formatOrderMessage(order: {
  orderId: string
  customerName: string
  customerPhone: string
  customerTelegram?: string
  items: { name: string; price: string }[]
  total: number
}): string {
  const itemsList = order.items.map((item) => `  • ${item.name} - ${item.price}₽`).join('\n')

  return `
🌱 <b>Новый заказ #${order.orderId}</b>

👤 <b>Клиент:</b>
   Имя: ${order.customerName}
   📱 Телефон: ${order.customerPhone}${order.customerTelegram ? `\n   💬 Telegram: @${order.customerTelegram}` : ''}

📦 <b>Товары:</b>
${itemsList}

💰 <b>Итого: ${order.total}₽</b>
  `.trim()
}
