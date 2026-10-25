import { afterAll, beforeAll, beforeEach, vi } from 'vitest'

import { loadTestDatabaseUrl } from './databaseSafety'

const databaseUrl = loadTestDatabaseUrl()
process.env.DATABASE_URL = databaseUrl
process.env.TEST_DATABASE_URL = databaseUrl
Object.assign(process.env, {
  PORT: '3001',
  HOST_ENV: 'local',
  JWT_SECRET: 'test-only-secret',
  FRONTEND_URL: 'http://localhost:5173',
  CLOUDINARY_CLOUD_NAME: 'test',
  CLOUDINARY_API_KEY: 'test',
  CLOUDINARY_API_SECRET: 'test',
  DEBUG: 'tests:disabled',
  TELEGRAM_PROXY_URL: 'http://127.0.0.1:1',
  TELEGRAM_PROXY_SECRET: 'test-only',
})

vi.mock('../lib/logger', () => ({ logger: { info: vi.fn(), error: vi.fn() } }))
vi.mock('../lib/telegram', async (importOriginal) => {
  const original = await importOriginal<typeof import('../lib/telegram')>()
  return { ...original, sendTelegramMessage: vi.fn().mockResolvedValue(true) }
})
vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network disabled in tests')))

let prisma: typeof import('./helpers').prisma
beforeAll(async () => {
  prisma = (await import('./helpers')).prisma
})

const cleanDatabase = async () => {
  // Delete in dependency order; never truncate unrelated or future tables.
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.passwordResetToken.deleteMany(),
    prisma.user.deleteMany(),
    prisma.plantInstance.deleteMany(),
    prisma.plant.deleteMany(),
    prisma.genus.deleteMany(),
    prisma.variegation.deleteMany(),
    prisma.lifeForm.deleteMany(),
  ])
}

beforeEach(async () => {
  await cleanDatabase()
  vi.clearAllMocks()
})

afterAll(async () => {
  if (prisma) {
    try {
      await cleanDatabase()
    } finally {
      await prisma.$disconnect()
    }
  }
})
