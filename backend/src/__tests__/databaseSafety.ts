import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { parse } from 'dotenv'

export const assertTestDatabaseUrl = (
  testUrl: string | undefined,
  workingUrls: string[],
) => {
  if (!testUrl) {
    throw new Error('Set TEST_DATABASE_URL in backend/.env.test before running tests')
  }
  const target = new URL(testUrl)
  const localHosts = ['localhost', '127.0.0.1', '[::1]']
  if (
    !['postgres:', 'postgresql:'].includes(target.protocol) ||
    !localHosts.includes(target.hostname) ||
    target.pathname !== '/plants_test' ||
    target.username !== 'plants_test' ||
    (target.searchParams.get('schema') || 'public') !== 'public' ||
    [...target.searchParams.keys()].some((key) => key !== 'schema')
  ) {
    throw new Error(
      'Tests require a local plants_test database, plants_test user and public schema',
    )
  }
  const identity = (url: URL) =>
    `${localHosts.includes(url.hostname) ? 'local' : url.hostname}:${url.port || '5432'}${decodeURIComponent(url.pathname)}`
  if (workingUrls.some((value) => identity(new URL(value)) === identity(target))) {
    throw new Error('Test database must differ from every configured working database')
  }
  return testUrl
}

export const loadTestDatabaseUrl = () => {
  const backendRoot = resolve(__dirname, '../..')
  const readEnv = (path: string) => (existsSync(path) ? parse(readFileSync(path)) : {})
  const localTestEnv = readEnv(resolve(backendRoot, '.env.test'))
  const workingUrls = [
    process.env.DATABASE_URL,
    readEnv(resolve(backendRoot, '.env')).DATABASE_URL,
    readEnv(resolve(backendRoot, '../.env')).DATABASE_URL,
  ].filter((value): value is string => Boolean(value))
  return assertTestDatabaseUrl(
    process.env.TEST_DATABASE_URL || localTestEnv.TEST_DATABASE_URL,
    workingUrls,
  )
}
