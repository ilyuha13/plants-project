/**
 * Простой логгер для development и scripts
 * В production лучше использовать winston или pino
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug'

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production'

  info(message: string, emoji = 'ℹ️') {
    this.log('info', emoji, message, colors.blue)
  }

  success(message: string, emoji = '✅') {
    this.log('success', emoji, message, colors.green)
  }

  warn(message: string, emoji = '⚠️') {
    this.log('warn', emoji, message, colors.yellow)
  }

  error(message: string, emoji = '❌') {
    this.log('error', emoji, message, colors.red)
  }

  debug(message: string, emoji = '🐛') {
    if (this.isDevelopment) {
      this.log('debug', emoji, message, colors.gray)
    }
  }

  private log(level: LogLevel, emoji: string, message: string, color: string) {
    const timestamp = new Date().toISOString()
    const formattedMessage = `${color}${emoji} [${level.toUpperCase()}] ${message}${colors.reset}`

    // eslint-disable-next-line no-console
    console.log(`${colors.gray}${timestamp}${colors.reset} ${formattedMessage}`)
  }

  // Для скриптов - красивый вывод без timestamp
  script(emoji: string, message: string) {
    // eslint-disable-next-line no-console
    console.log(`${emoji}  ${message}`)
  }
}

export const logger = new Logger()
