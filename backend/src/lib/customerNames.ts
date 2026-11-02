import { z } from 'zod'

export const customerNameFields = {
  firstName: z.string().trim().min(1, 'Укажите имя').max(100),
  lastName: z.string().trim().max(100).default(''),
  patronymic: z.string().trim().max(100).default(''),
}

export const formatCustomerName = (value: {
  firstName: string
  lastName: string
  patronymic: string
}) => [value.lastName, value.firstName, value.patronymic].filter(Boolean).join(' ')
