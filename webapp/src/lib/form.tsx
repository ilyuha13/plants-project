import { FormikHelpers, useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { AlertProps } from '../components/Alert/Alert'
import { ButtonProps } from '../components/Button/Button'

export const useForm = <TZodSchema extends z.ZodTypeAny>({
  successMessage = false,
  resetOnSuccess = true,
  redirectOnSuccess,
  showValidationAlert = false,
  initialValues = {},
  validationSchema,
  onSubmit,
}: {
  successMessage?: string | false
  resetOnSuccess?: boolean
  redirectOnSuccess?: string
  showValidationAlert?: boolean
  initialValues?: z.infer<TZodSchema>
  validationSchema?: TZodSchema
  onSubmit: (
    values: z.infer<TZodSchema>,
    actions: FormikHelpers<z.infer<TZodSchema>>,
  ) => Promise<void>
}) => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<Error | null>(null)

  const navigate = useNavigate()

  const formik = useFormik<z.infer<TZodSchema>>({
    initialValues,
    ...(validationSchema && { validate: withZodSchema(validationSchema) }),
    onSubmit: async (values, formikHelpers) => {
      try {
        setSubmittingError(null)
        await onSubmit(values, formikHelpers)
        if (resetOnSuccess) {
          formik.resetForm()
        }
        if (redirectOnSuccess) {
          void navigate(redirectOnSuccess)
          return
        }

        setSuccessMessageVisible(true)
        setTimeout(() => {
          setSuccessMessageVisible(false)
        }, 3000)
      } catch (error: unknown) {
        setSubmittingError(error instanceof Error ? error : new Error(String(error)))
      }
    },
  })

  const alertOptions = useMemo<AlertProps & { hidden: boolean }>(() => {
    if (submittingError) {
      return {
        hidden: false,
        children: submittingError.message,
        type: 'error',
      }
    }
    if (showValidationAlert && !formik.isValid && !!formik.submitCount) {
      return {
        hidden: false,
        children: 'некоторые поля заполнены неверно',
        type: 'error',
      }
    }
    if (successMessageVisible && successMessage) {
      return {
        hidden: false,
        children: successMessage,
        type: 'success',
      }
    }
    return {
      type: 'error',
      hidden: true,
      children: null,
    }
  }, [
    submittingError,
    formik.isValid,
    formik.submitCount,
    successMessageVisible,
    successMessage,
    showValidationAlert,
  ])

  const buttonProps = useMemo<Omit<ButtonProps, 'children'>>(() => {
    return {
      type: 'submit',
      loading: formik.isSubmitting,
    }
  }, [formik.isSubmitting])

  return {
    formik,
    alertOptions,
    buttonProps,
  }
}
