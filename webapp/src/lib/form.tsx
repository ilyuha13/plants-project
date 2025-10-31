import { FormikHelpers, useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { AlertProps } from '../components/Alert/Alert'
import { ButtonProps } from '../components/Button/Button'

export const useForm = <TZodSchema extends z.ZodTypeAny>({
  successMessage = false,
  resetOnSuccess = true,
  showValidationAlert = false,
  initialValues = {},
  validationSchema,
  onSubmit,
}: {
  successMessage?: string | false
  resetOnSuccess?: boolean
  showValidationAlert?: boolean
  initialValues?: z.infer<TZodSchema>
  validationSchema?: TZodSchema
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: z.infer<TZodSchema>, actions: FormikHelpers<z.infer<TZodSchema>>) => Promise<any> | any
}) => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<Error | null>(null)

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
        setSuccessMessageVisible(true)
        setTimeout(() => {
          setSuccessMessageVisible(false)
        }, 3000)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setSubmittingError(error)
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
  }, [submittingError, formik.isValid, formik.submitCount, successMessageVisible, successMessage, showValidationAlert])

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
