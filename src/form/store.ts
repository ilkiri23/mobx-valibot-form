import type { SyntheticEvent } from 'react'
import { makeAutoObservable, runInAction } from 'mobx'
import {
  getProperty,
  setProperty,
  hasProperty
} from 'dot-prop'
import type { ObjectSchema, InferInput } from 'valibot'
import { groupBy, parseSchema } from './utils'
import type {
  AnyObject,

  FormOptions,
  FormOptionsWithSchema,
  FormErrors,
  FormResetOptions,
  
  FieldName,
  FieldValue,
  FieldError,
  FieldResetOptions,
} from './types'


export function createFormStore<TSchema extends ObjectSchema<any, any>>(options: FormOptionsWithSchema<TSchema>): FormStore<InferInput<TSchema>>
export function createFormStore<TValues extends AnyObject>(options: FormOptions<TValues>): FormStore<TValues>
export function createFormStore(options: FormOptions<AnyObject> & { schema?: ObjectSchema<any, any> }) {
  return new FormStore(options)
}

export class FormStore<TFormValues extends AnyObject = AnyObject> {
  _options
  _output
  
  values: TFormValues
  errors: FormErrors<TFormValues>

  isSubmitting: boolean

  constructor(options: FormOptions<TFormValues, any> & { schema?: ObjectSchema<any, any> }) {
    this._options = options
    this._output = null as any
    
    this.values = options.initialValues
    this.errors = {}

    this.isSubmitting = false

    makeAutoObservable(
      this,
      { _options: false },
      { autoBind: true }
    )
  }


  /**
   * Clear errors of the entire form
   */ 
  clearErrors(): void

  /**
   * Clear errors of the spefic field
   * @param name - name of the field
   */
  clearErrors<TFieldName extends FieldName<TFormValues>>(name: TFieldName): void

  /**
   * Clear errors of specific fields
   * @param names - array of field names
   */
  clearErrors<TFieldName extends FieldName<TFormValues>>(names: TFieldName[]): void

  clearErrors<TFieldName extends FieldName<TFormValues>>(arg1?: TFieldName | TFieldName[]): void {
    if (arg1 !== undefined) {
      const names = Array.isArray(arg1) ? arg1 : [arg1]
      names.forEach(name => { delete this.errors[name] })
      return
    }

    this.errors = {}
  }


  /**
   * Add error for the specific field
   * @param name - name of the field
   * @param error - error object
   */
  addError<TFieldName extends FieldName<TFormValues>>(name: TFieldName, error: FieldError): void {
    if (this.errors[name] !== undefined) {
      this.errors[name].push(error)
      return
    }

    this.errors[name] = [error]
  }


  /**
   * Validate the entire form
   */
  async validate() {
    const {
      isValid,
      errors,
      output
    } = await parseSchema(this.values, this._options.schema)

    runInAction(() => {
      this._output = output
      this.errors = groupBy(
        errors,
        error => {
          return error.valibotIssue.path?.map((item, index) => {
            if (index === 0) return item.key
            if (item.type === 'array') return `[${item.key}]`
            return `.${item.key}`
          }).join('') || ''
        }
      )
    })

    return isValid
  }

  async submit(event?: SyntheticEvent): Promise<void> {
    event?.preventDefault()

    const isValid = await this.validate()
    if (!isValid) return

    try {
      runInAction(() => { this.isSubmitting = true })
      await this._options?.onSubmit?.(this._output, this)
    } catch {
      //
    } finally {
      runInAction(() => { this.isSubmitting = false })
    }
  }


  /**
   * Update values of the entire form
   * @param values - values to update the form.
   */
  update(values: TFormValues): void

  /**
   * Update value of the specific field
   * @param name - name of the field
   * @param value - value to update the field
   */
  update<
    TFieldName extends FieldName<TFormValues>,
    TFieldValue extends FieldValue<TFormValues, TFieldName>
  >(
    name: TFieldName,
    value: TFieldValue
  ): void

  update<
    TFieldName extends FieldName<TFormValues>,
    TFieldValue extends FieldValue<TFormValues, TFieldName>
  >(
    arg1: TFormValues | TFieldName,
    arg2?: TFieldValue
  ) {
    if (typeof arg1 === 'string') {
      setProperty(this.values, arg1, arg2)
      return
    }

    this.values = arg1
  }


  /**
   * Reset the form to its initial state
   * @param options - reset options
   */
  reset(options?: FormResetOptions<TFormValues>): void

  /**
   * Reset the specific field
   * @param name - name of the field
   * @param options - reset options
   */
  reset<
    TFieldName extends FieldName<TFormValues>,
    TFieldValue extends FieldValue<TFormValues, TFieldName>
  >(
    name: TFieldName,
    options?: FieldResetOptions<TFieldValue>
  ): void

  reset<
    TFieldName extends FieldName<TFormValues>,
    TFieldValue extends FieldValue<TFormValues, TFieldName>
  >(
    arg1?: FormResetOptions<TFormValues> | TFieldName,
    arg2?: FieldResetOptions<TFieldValue>
  ) {
    if (typeof arg1 === 'string') {
      const name = arg1
      const options = arg2 || {}
      const {
        keepValue = false,
        keepErrors = false,
        initialValue
      } = options

      if (hasProperty(options, 'initialValue')) {
        setProperty(this._options.initialValues, name, initialValue)
      }

      if (!keepValue && hasProperty(this._options.initialValues, name)) {
        this.update(name, getProperty(this._options.initialValues, name)!)
      }

      if (!keepErrors) this.clearErrors(name)

      return
    }

    const options = arg1 || {}
    const {
      keepValues = false,
      keepErrors = false,
      initialValues
    } = options

    if (initialValues !== undefined) {
      this._options.initialValues = initialValues
    }

    if (!keepValues) {
      this.update(this._options.initialValues)
    }

    if (!keepErrors) this.clearErrors()
  }

  field<
    TFieldName extends FieldName<TFormValues>,
    TFieldValue extends FieldValue<TFormValues, TFieldName>
  >(name: TFieldName) {
    const form = this
    return {
      get value() { return getProperty(form.values, name) as TFieldValue },
      get errors() { return form.errors[name] || [] },
      update: (value: TFieldValue) => form.update(name, value),
      reset: (options?: FieldResetOptions<TFieldValue>) => form.reset(name, options),
      addError: (error: FieldError) => form.addError(name, error),
      clearErrors: () => form.clearErrors(name),
    }
  }
}