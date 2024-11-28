import { vi, describe, test, expect } from 'vitest'
import * as v from 'valibot'
import { createFormStore, FormStore } from './form/store'


test('creates FormStore instance', () => {
  const form = createFormStore({
    initialValues: {
      name: 'Morty',
      age: 14
    }
  })

  expect(form).toBeInstanceOf(FormStore)
  expect(form.values).toEqual({ name: 'Morty', age: 14 })
  expect(form.errors).toEqual({})
  expect(form.isSubmitting).toBe(false)
})

test('updates form values', () => {
  const form = createFormStore({
    initialValues: {
      name: 'Morty',
      age: 14,
    }
  })

  form.update({ name: 'Rick', age: 70 })
  expect(form.values).toEqual({ name: 'Rick', age: 70 })
})

test('updates field value', () => {
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

test('validates form', async () => {
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

  test('submit form with valid data', async () => {
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

test('adds error to field', () => {
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

  expect(form.errors).toEqual({
    email: [{
      type: 'from_server',
      message: 'An account with this email address already exists'
    }]
  })

  form.addError('password', {
    type: 'from_server',
    message: 'Password cannot contain sequential characters, such as "abcd" or "1234"'
  })

  form.addError('password', {
    type: 'from_server',
    message: 'Password is too common. Please choose a more unique password'
  })

  expect(form.errors).toEqual({
    email: [{
      type: 'from_server',
      message: 'An account with this email address already exists'
    }],
    password: [
      {
        type: 'from_server',
        message: 'Password cannot contain sequential characters, such as "abcd" or "1234"'
      },
      {
        type: 'from_server',
        message: 'Password is too common. Please choose a more unique password'
      }
    ]
  })
})

test('clears all errors', () => {
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

  form.addError('password', {
    type: 'from_server',
    message: 'Password cannot contain sequential characters, such as "abcd" or "1234"'
  })

  form.addError('password', {
    type: 'from_server',
    message: 'Password is too common. Please choose a more unique password'
  })

  form.clearErrors()

  expect(form.errors).toEqual({})
})

test('clears errors from specific field', () => {
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

  form.addError('password', {
    type: 'from_server',
    message: 'Password cannot contain sequential characters, such as "abcd" or "1234"'
  })

  form.addError('password', {
    type: 'from_server',
    message: 'Password is too common. Please choose a more unique password'
  })

  form.clearErrors('email')

  expect(form.errors).toEqual({
    password: [
      {
        type: 'from_server',
        message: 'Password cannot contain sequential characters, such as "abcd" or "1234"'
      },
      {
        type: 'from_server',
        message: 'Password is too common. Please choose a more unique password'
      }
    ]
  })

  form.clearErrors('password')

  expect(form.errors).toEqual({})
})

test('clears errors from multiple fields', async () => {
  const form = createFormStore({
    schema: v.object({
      firstName: v.pipe(v.string(), v.nonEmpty()),
      lastName: v.pipe(v.string(), v.nonEmpty()),
      bio: v.pipe(v.string(), v.nonEmpty())
    }),
    initialValues: {
      firstName: '',
      lastName: '',
      bio: ''
    }
  })

  await form.validate()

  form.clearErrors(['firstName', 'lastName'])

  expect(form.errors).toEqual({
    bio: [expect.objectContaining({
      type: 'non_empty',
      message: 'Invalid length: Expected !0 but received 0'
    })],
  })
})

test('resets form to its initial state', async () => {
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

test('keeps values during reset', () => {
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

  form.reset({ keepValues: true })

  expect(form.values).toEqual({ email: 'jane.doe@example.com', password: '12345678' })
  expect(form.errors).toEqual({})
})

test('keeps errors during reset', () => {
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

test('resets form with new initial values', () => {
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

test('resets field with new initial value', () => {
  const form = createFormStore({
    initialValues: {
      name: 'Morty',
      age: 14
    }
  })

  form.reset('name', { initialValue: 'Rick' })
  expect(form.values).toEqual({ name: 'Rick', age: 14 })

  form.reset('age', { initialValue: 70 })
  expect(form.values).toEqual({ name: 'Rick', age: 70 })

  form.update({ name: 'Jerry', age: 35 })
  expect(form.values).toEqual({ name: 'Jerry', age: 35 })

  form.reset()
  expect(form.values).toEqual({ name: 'Rick', age: 70 })
})
