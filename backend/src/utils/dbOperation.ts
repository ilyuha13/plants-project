import { logger } from './logger'

interface SuccessResult<T> {
  success: true
  data: T
}

export interface ErrorResult {
  success: false
  message: string
  error: string
}

export type Result<T> = SuccessResult<T> | ErrorResult

/**
 * Type Guard: проверяет что результат успешный
 * После проверки TypeScript знает что result.data доступен
 */
export function isSuccess<T>(result: Result<T>): result is SuccessResult<T> {
  return result.success === true
}

/**
 * Type Guard: проверяет что результат - ошибка
 */
export function isError<T>(result: Result<T>): result is ErrorResult {
  return result.success === false
}

/**
 * Обертка для операций с базой данных с обработкой ошибок
 * @param operation - Функция, выполняющая операцию с БД
 * @param errorCode - Код ошибки для логирования и фронтенда
 * @param context - Контекст ошибки для логирования
 * @returns Result с данными или ошибкой
 */

export async function dbOperation<T>(operation: () => Promise<T>, context: string): Promise<Result<T>> {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (error: unknown) {
    // Безопасное форматирование ошибки
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined

    logger.error(`[DB_ERROR] ${context}: ${errorMessage}`)

    // В dev режиме логируем stack trace для отладки
    if (process.env.NODE_ENV !== 'production' && errorStack) {
      console.error(errorStack)
    }

    return {
      success: false,
      message: 'Произошла ошибка при работе с базой данных',
      error: 'DB_ERROR',
    }
  }
}
