import type { FormHTMLAttributes } from 'react'
import { observer } from 'mobx-react-lite'
import type { FormStore } from '../store'
import type { AnyObject } from '../types'


export type FormProps<TFormValues extends AnyObject> =
  & Omit<
      FormHTMLAttributes<HTMLFormElement>,
      'onSubmit' | 'onReset'
    >
  & { of: FormStore<TFormValues> }

export const Form = observer(<
  TFormValues extends AnyObject
>(props: FormProps<TFormValues>) => {
  const { of: form, children, ...otherProps } = props
  return (
    <form
      {...otherProps}
      noValidate
      onSubmit={form.submit}
      onReset={form.reset}
    >
      {children}
    </form>
  )
})