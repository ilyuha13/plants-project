import { describe, expect, it } from 'vitest'

import { assertTestDatabaseUrl } from './databaseSafety'

const safe = 'postgresql://plants_test:local@localhost:5432/plants_test?schema=public'

describe('Test database safety', () => {
  it('allows only the dedicated local database', () => {
    expect(assertTestDatabaseUrl(safe, [])).toBe(safe)
  })
  it('rejects missing configuration', () => {
    expect(() => assertTestDatabaseUrl(undefined, [])).toThrow()
  })
  it.each([
    safe.replace('/plants_test?', '/plants?'),
    safe.replace('@localhost', '@example.com'),
    safe.replace('plants_test:local', 'postgres:local'),
    safe.replace('schema=public', 'schema=work'),
    `${safe}&host=example.com`,
  ])('rejects an unsafe target', (url) => {
    expect(() => assertTestDatabaseUrl(url, [])).toThrow()
  })
  it('rejects the same database even with different credentials and localhost spelling', () => {
    expect(() =>
      assertTestDatabaseUrl(safe, [
        'postgresql://other:secret@127.0.0.1/plants_test?schema=work',
      ]),
    ).toThrow('must differ')
  })
})
