import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

import { loadTestDatabaseUrl } from './databaseSafety'

export default function globalSetup() {
  const databaseUrl = loadTestDatabaseUrl()
  execFileSync('pnpm', ['exec', 'prisma', 'generate'], {
    cwd: resolve(__dirname, '../..'),
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  })
  execFileSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], {
    cwd: resolve(__dirname, '../..'),
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  })
}
