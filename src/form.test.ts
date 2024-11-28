import { vi, describe, test, expect } from 'vitest'
import * as v from 'valibot'
import { createFormStore, FormStore } from './form/store'

test('creates a new FormStore instance', () => {
  const form = createFormStore({
    initialValues: {
      name: 'Morty',
      age: 14
    }
  })

  expect(form).toBeInstanceOf(FormStore)
  expect(form.values).toEqual({ name: 'Morty', age: 14 })
  expect(form.errors).toEqual({})
  expect(form.isValid).toBe(true)
  expect(form.isSubmitting).toBe(false)
})

test('updates the entire form', () => {
  const form = createFormStore({
    initialValues: {
      name: 'Morty',
      age: 14,
    }
  })

  form.update({ name: 'Rick', age: 70 })
  expect(form.values).toEqual({ name: 'Rick', age: 70 })
})

test('updates the specific field', () => {
  const form = createFormStore({
    initialValues: {
      name: 'Morty',
      age: 14
    }
  })

  form.update('name', 'Rick')
  expect(form.values).toEqual({ name: 'Rick', age: 14 })

  form.update('age', 70)
  expect(form.values).toEqual({ name: 'Rick', age: 70 })
})

test('validates the form', async () => {
  const form = createFormStore({
    schema: v.object({
      email: v.pipe(v.string(), v.email()),
      password: v.pipe(v.string(), v.minLength(8))
    }),
    initialValues: {
      email: '',
      password: ''
    }
  })

  await form.validate()
  expect(form.errors).toEqual({
    email: [expect.objectContaining({
      type: 'email',
      message: 'Invalid email: Received ""' 
    })],
    password: [expect.objectContaining({
      type: 'min_length',
      message: 'Invalid length: Expected >=8 but received 0'
    })]
  })
})

describe('Submission', () => {
  test('should call `options.onSubmit` handler when calling `form.submit()`', async () => {
    const onSubmit = vi.fn()
    const form = createFormStore({
      onSubmit,
      initialValues: {
        username: ''
      }   
    })
    await form.submit()
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  test('should submit form with valid data', async () => {
    const onSubmit = vi.fn()
    const form = createFormStore({
      schema: v.object({
        email: v.pipe(v.string(), v.email()),
        password: v.pipe(v.string(), v.minLength(8))
      }),
      initialValues: {
        email: '',
        password: ''
      },
      onSubmit
    })

    await form.submit()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(form.errors).toEqual({
      email: [expect.objectContaining({
        type: 'email',
        message: 'Invalid email: Received ""' 
      })],
      password: [expect.objectContaining({
        type: 'min_length',
        message: 'Invalid length: Expected >=8 but received 0'
      })]
    })

    form.update({ email: 'john.doe@example.com', password: '12345678' })
    await form.submit()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(form.errors).toEqual({})
  })
})

test('adds errors to fields', () => {
  const form = createFormStore({
    initialValues: {
      email: 'john.doe@example.com',
      password: '12345678'
    }
  })

  form.addError('email', {
    type: 'from_server',
    message: 'An account with this email address already exists'
  })

  expect(Object.keys(form.errors)).toHaveLength(1)
  expect(form.errors).toEqual({
    email: [{
      type: 'from_server',
      message: 'An account with this email address already exists'
    }]
  })

  form.addError('password', {
    type: 'from_server',
    message: ''
  })

  expect(Object.keys(form.errors)).toHaveLength(2)
  expect(form.errors).toEqual({
    email: [{
      type: 'from_server',
      message: 'An account with this email address already exists'
    }],
    password: [{
      type: 'from_server',
      message: ''
    }]
  })
})

test('clears errors from fields', () => {
  // const schema = v.object({
  //   firstName: v.pipe(v.string(), v.nonEmpty()),
  //   lastName: v.pipe(v.string(), v.nonEmpty()),
  //   age: v.nullish(v.number()),
  // })
  // const form = createFormStore({
  //   schema,
  //   initialValues: {
  //     firstName: '',
  //     lastName: ''
  //   }
  // })

  // form.addError('email', {
  //   type: 'from_server',
  //   message: 'An account with this email address already exists'
  // })

  // expect(Object.keys(form.errors)).toHaveLength(1)
  // expect(form.errors).toEqual({
  //   email: [{
  //     type: 'from_server',
  //     message: 'An account with this email address already exists'
  //   }]
  // })

  // form.clearErrors()
  // expect(Object.keys(form.errors)).toHaveLength(0)
  // expect(form.errors).toEqual({})
})

test('reset form to its initial state', async () => {
  const form = createFormStore({
    initialValues: {
      email: 'john.doe@example.com',
      password: '12345678'
    }
  })

  form.update('email', 'jane.doe@example.com')
  form.addError('email', {
    type: 'from_server',
    message: 'An account with this email address already exists'
  })
  
  expect(form.values).toEqual({ email: 'jane.doe@example.com', password: '12345678' })
  expect(form.errors).toEqual({
    email: [{
      type: 'from_server',
      message: 'An account with this email address already exists'
    }]
  })

  form.reset()
  expect(form.values).toEqual({ email: 'john.doe@example.com', password: '12345678' })
  expect(form.errors).toEqual({})
})

test.skip('reset form with new initial values', () => {
  const form = createFormStore({
    initialValues: {
      name: 'Morty',
      age: 14
    }
  })

  form.reset({ initialValues: { name: 'Rick', age: 70 } })
  expect(form.values).toEqual({ name: 'Rick', age: 70 })

  form.update({ name: 'Jerry', age: 35 })
  expect(form.values).toEqual({ name: 'Jerry', age: 35 })
  form.reset()
  expect(form.values).toEqual({ name: 'Rick', age: 70 })
})

test('should keep the form values when calling `form.reset({ keepValues: true })`', () => {
  const form = createFormStore({
    initialValues: {
      email: 'john.doe@example.com',
      password: '12345678'
    }
  })

  form.update({ email: 'jane.doe@example.com', password: '12345678' })
  form.addError('email', {
    type: 'from_server',
    message: 'An account with this email address already exists'
  })
  expect(form.values).toEqual({ email: 'jane.doe@example.com', password: '12345678' })
  expect(form.errors).toEqual({
    email: [{
      type: 'from_server',
      message: 'An account with this email address already exists'
    }]
  })

  form.reset({ keepValues: true })
  expect(form.values).toEqual({ email: 'jane.doe@example.com', password: '12345678' })
  expect(form.errors).toEqual({})
})

test('should keep the form errors when calling `form.reset({ keepErrors: true })`', () => {
  const form = createFormStore({
    initialValues: {
      email: 'john.doe@example.com',
      password: '12345678'
    }
  })

  form.update('email', 'jane.doe@example.com')
  form.addError('email', {
    type: 'from_server',
    message: 'An account with this email address already exists'
  })
  expect(form.values).toEqual({ email: 'jane.doe@example.com', password: '12345678' })
  expect(form.errors).toEqual({
    email: [{
      type: 'from_server',
      message: 'An account with this email address already exists'
    }]
  })

  form.reset({ keepErrors: true })
  expect(form.values).toEqual({ email: 'john.doe@example.com', password: '12345678' })
  expect(form.errors).toEqual({
    email: [{
      type: 'from_server',
      message: 'An account with this email address already exists'
    }]
  })
})