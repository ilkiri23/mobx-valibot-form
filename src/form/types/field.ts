import type { BaseIssue } from 'valibot'
import type {
  AnyObject,
  FromPairs,
  ToAllPossiblePairs
} from './common'


export type FieldName<TFormValues extends AnyObject> =
  Exclude<
    keyof FromPairs<ToAllPossiblePairs<TFormValues>>,
    number | symbol
  >

export type FieldValue<
  TFormValues extends AnyObject,
  TFieldName extends FieldName<TFormValues>
> = FromPairs<ToAllPossiblePairs<TFormValues>>[TFieldName]

export type FieldError = {
  type: string
  message: string
  valibotIssue?: BaseIssue<any>
}

export type FieldResetOptions<TFieldValue> = {
  initialValue?: TFieldValue
  keepValue?: boolean
  keepErrors?: boolean
}

export type FieldAccessor<
  TFormValues extends AnyObject,
  TFieldName extends FieldName<TFormValues>,
  TFieldValue extends FieldValue<TFormValues, TFieldName>
    = FieldValue<TFormValues, TFieldName>
> = {
  readonly value: TFieldValue
  readonly errors: FieldError[]
  update: (value: TFieldValue) => void
  reset: (options?: FieldResetOptions<TFieldValue>) => void
  addError: (error: FieldError) => void
  clearErrors: () => void
}