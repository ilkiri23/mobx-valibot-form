import { useState, useMemo } from 'react'
import {
  Form, type FormProps,
  Field, type FieldProps
} from '../components'
import type { FormStore } from '../store'
import type { AnyObject, FieldName } from '../types'


export function useForm<TFormValues extends AnyObject>(init: () => FormStore<TFormValues>) {
  const [form] = useState(init)
  return useMemo(
    () => [
      form,
      {
        Form(props: Omit<FormProps<TFormValues>, 'of'>) {
          return <Form of={form} {...props} />
        },
        Field<
          TFieldName extends FieldName<TFormValues>
        >(props: Omit<FieldProps<TFormValues, TFieldName>, 'of'>) {
          return <Field of={form} {...props} />
        },
      }
    ] as const,
    [form]
  )
}