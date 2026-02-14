/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EOL } from 'os'

import debug from 'debug'
import _ from 'lodash'
import pc from 'picocolors'
import { serializeError } from 'serialize-error'
import winston from 'winston'
import * as yaml from 'yaml'

import { env } from './env'
import { deepMap } from '../utils/deepMap'

const winstonLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'backend-service', hostEnv: env.HOST_ENV },
  transports: [
    new winston.transports.Console({
      format:
        env.HOST_ENV === 'production'
          ? winston.format.json()
          : winston.format.printf((logData) => {
              const setColor = {
                info: (str: string) => pc.blue(str),
                error: (str: string) => pc.red(str),
                debug: (str: string) => pc.cyan(str),
              }[logData.level as 'info' | 'error' | 'debug']
              const logType = (logData as any).logType || ''
              const timestamp = String(logData.timestamp || '')
              const levelAndType = `${logData.level} ${logType}`
              const topMessage = `${setColor(levelAndType)} ${pc.green(timestamp)}${EOL}${logData.message}`

              const visibleMessageTags = _.omit(logData, [
                'level',
                'logType',
                'timestamp',
                'message',
                'service',
                'timestamp',
                Symbol.for('level'),
              ])

              const stringifyedLogData = _.trim(
                yaml.stringify(visibleMessageTags, (_k, v) =>
                  _.isFunction(v) ? 'function' : v,
                ),
              )

              const parts = [
                topMessage,
                Object.keys(visibleMessageTags).length > 0
                  ? `${EOL}${stringifyedLogData}`
                  : '',
              ].filter(Boolean)

              return parts.join('') + EOL
            }),
    }),
  ],
})

type Meta = Record<string, unknown> | undefined
const prettifyMeta = (meta: Meta): Meta => {
  return deepMap(meta, ({ key, value }) => {
    if (
      [
        'email',
        'password',
        'token',
        'newPassword',
        'confirmPassword',
        'oldPassword',
        'text',
        'description',
      ].includes(key.toLowerCase())
    ) {
      return '***'
    }
    return value
  })
}

export const logger = {
  info: (logType: string, message: string, meta?: Meta) => {
    if (!debug.enabled(`plantshop:${logType}`)) {
      return
    }
    winstonLogger.info(message, { logType, ...prettifyMeta(meta) })
  },
  error: (logType: string, error: any, meta?: Meta) => {
    if (!debug.enabled(`plantshop:${logType}`)) {
      return
    }
    const serializedError = serializeError(error)
    winstonLogger.error(serializedError.message || 'Unknown error', {
      logType,
      error,
      errorStack: serializedError.stack,
      ...prettifyMeta(meta),
    })
  },
}
