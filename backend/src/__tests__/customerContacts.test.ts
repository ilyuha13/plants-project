import { describe, expect, it } from 'vitest'

import { customerContactFields } from '../lib/customerContacts'

describe('Contact formats', () => {
  it.each([
    'username',
    '@username',
    't.me/username',
    'https://t.me/username/',
    'https://telegram.me/username?x=1',
  ])('normalizes Telegram %s', (value) => {
    expect(customerContactFields.telegram.parse(value)).toBe('@username')
  })
  it.each([
    'username',
    '@username',
    'vk.com/username',
    'https://m.vk.com/username/',
    'https://vk.ru/username?from=profile',
  ])('normalizes VK %s', (value) => {
    expect(customerContactFields.vk.parse(value)).toBe('https://vk.com/username')
  })
  it('supports a numeric VK profile ID', () => {
    expect(customerContactFields.vk.parse('id123456')).toBe('https://vk.com/id123456')
  })
  it.each([
    'Иван Иванов',
    '+79991234567',
    'https://example.com/username',
    'https://t.me/+invite',
    '@joinchat',
    'https://t.me/share/url',
    'https://t.me/username/123',
  ])('rejects a Telegram non-profile %s', (value) => {
    expect(customerContactFields.telegram.safeParse(value).success).toBe(false)
  })
  it.each([
    'Иван Иванов',
    'https://example.com/username',
    'https://vk.com/club123',
    'https://vk.com/feed',
    'https://vk.com/wall123_456',
    'https://vk.com/username/photos',
  ])('rejects a VK non-profile %s', (value) => {
    expect(customerContactFields.vk.safeParse(value).success).toBe(false)
  })
  it('keeps empty optional fields empty', () => {
    expect(customerContactFields.telegram.parse(' ')).toBe('')
    expect(customerContactFields.vk.parse(' ')).toBe('')
  })
})
