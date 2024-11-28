import { useMemo, useEffect, type ReactNode } from 'react'
import { observer } from 'mobx-react-lite'
import type { FormStore } from '../store'
import type {
  AnyObject,
  FieldName,
  FieldAccessor
} from '../types'


export type FieldProps<
  TFormValues extends AnyObject,
  TFieldName extends FieldName<TFormValues>,
> = {
  of: FormStore<TFormValues>
  name: TFieldName,
  children: (field: FieldAccessor<TFormValues, TFieldName>) => ReactNode,
}

export const Field = observer(<
  TFormValues extends AnyObject,
  TFieldName extends FieldName<TFormValues>
>(props: FieldProps<TFormValues, TFieldName>) => {
  const { of: form, name, children } = props
  const field = useMemo(() => form.field(name), [form, name])
  useEffect(
    () => { return () => form.reset(name) },
    [form, name]
  )
  return children(field)
})