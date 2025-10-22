/**
 * Утилиты для работы с файлами и создания временных URL
 */

/**
 * Создает временный URL для файла с помощью URL.createObjectURL
 * @param file - файл для создания URL
 * @returns временный URL строкой
 */
export const createObjectURL = (file: File): string => {
  return URL.createObjectURL(file)
}

/**
 * Освобождает ресурсы временного URL
 * @param url - временный URL для освобождения
 */
export const revokeObjectURL = (url: string): void => {
  URL.revokeObjectURL(url)
}

/**
 * Создает временные URL для массива файлов
 * @param files - массив файлов
 * @returns массив объектов с файлом и его временным URL
 */
export const createObjectURLsForFiles = (files: File[]): Array<{ file: File; url: string }> => {
  return files.map((file) => ({
    file,
    url: createObjectURL(file),
  }))
}

/**
 * Освобождает ресурсы для массива временных URL
 * @param urls - массив временных URL или объектов с URL
 */
export const revokeObjectURLs = (urls: string[] | Array<{ url: string }>): void => {
  urls.forEach((item) => {
    const url = typeof item === 'string' ? item : item.url
    revokeObjectURL(url)
  })
}
