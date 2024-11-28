import type {
  ObjectSchema,
  InferInput,
  InferOutput
} from 'valibot'
import type { FormStore } from '../store'
import type { AnyObject } from './common'
import type { FieldName, FieldError } from './field'


export type FormOptions<TInput extends AnyObject, TOutput = TInput> = {
  initialValues: TInput
  onSubmit?: (
    values: TOutput,
    methods: Pick<
      FormStore<TInput>,
      'update' | 'reset' | 'addError'
    >
  ) => unknown | Promise<unknown>
}

export type FormOptionsWithSchema<TSchema extends ObjectSchema<any, any>> =
  & FormOptions<InferInput<TSchema>, InferOutput<TSchema>>
  & { schema: TSchema }

export type FormErrors<TFormValues extends AnyObject> = {
  [name in FieldName<TFormValues>]?: FieldError[];
}

export type FormResetOptions<TFormValues extends AnyObject> = {
  initialValues?: TFormValues
  keepValues?: boolean
  keepErrors?: boolean
}