import { z } from 'zod'

const profileName = (value: string, hosts: string[]) => {
  const trimmed = value.trim()
  if (!trimmed.includes('/')) {
    return trimmed.replace(/^@/, '')
  }
  try {
    const url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`)
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.port ||
      !hosts.includes(url.hostname.toLowerCase())
    ) {
      return trimmed
    }
    return /^\/[^/]+\/?$/.test(url.pathname)
      ? url.pathname.replace(/^\/|\/$/g, '')
      : trimmed
  } catch {
    return trimmed
  }
}

export const normalizeTelegram = (value: string) => {
  if (!value.trim()) {
    return ''
  }
  const name = profileName(value, ['t.me', 'www.t.me', 'telegram.me', 'www.telegram.me'])
  return /^[a-z][a-z0-9_]{0,31}$/i.test(name) &&
    !/^(joinchat|share|proxy|socks|addstickers|addemoji|c|s)$/i.test(name)
    ? `@${name}`
    : value.trim()
}

export const normalizeVk = (value: string) => {
  if (!value.trim()) {
    return ''
  }
  const name = profileName(value, [
    'vk.com',
    'www.vk.com',
    'm.vk.com',
    'vk.ru',
    'www.vk.ru',
    'm.vk.ru',
  ])
  return /^[a-z][a-z0-9_.]{0,63}$/i.test(name) &&
    !/^(club|public|event|wall|photo|video|topic|album)\d/i.test(name) &&
    !/^(feed|im|groups|friends|join|login|share\.php)$/i.test(name)
    ? `https://vk.com/${name}`
    : value.trim()
}

export const customerContactFields = {
  phone: z.string().trim().max(100).default(''),
  telegram: z
    .string()
    .trim()
    .max(500)
    .default('')
    .transform(normalizeTelegram)
    .refine(
      (value) =>
        !value || (value.startsWith('@') && normalizeTelegram(value.slice(1)) === value),
      'Укажите имя пользователя Telegram, например @username, или ссылку t.me/username',
    ),
  vk: z
    .string()
    .trim()
    .max(500)
    .default('')
    .transform(normalizeVk)
    .refine(
      (value) =>
        !value ||
        (/^https:\/\/vk\.com\/[a-z][a-z0-9_.]{0,63}$/i.test(value) &&
          normalizeVk(value.slice('https://vk.com/'.length)) === value),
      'Укажите ссылку на личную страницу ВКонтакте, например vk.com/username или vk.com/id123456',
    ),
}

export const hasCustomerContact = (value: {
  phone: string
  telegram: string
  vk: string
}) => Boolean(value.phone || value.telegram || value.vk)

export const formatCustomerContacts = (value: {
  phone: string
  telegram: string
  vk: string
}) =>
  [
    value.phone,
    value.telegram && `Telegram: ${value.telegram}`,
    value.vk && `ВКонтакте: ${value.vk}`,
  ]
    .filter(Boolean)
    .join('\n')
