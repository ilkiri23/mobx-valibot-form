import { useState } from 'react'
import { observer, Observer } from 'mobx-react-lite'
import { createFormStore, useForm } from 'mobx-valibot-form'
import * as v from 'valibot'

const SignUpSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8))
})

export const NativeForm = observer(() => {
  const [form] = useState(() => createFormStore({
    schema: SignUpSchema,
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit(values) {
      window.alert(JSON.stringify(values))
    }
  }))

  const emailField = form.field('email')
  const passwordField = form.field('password')

  return (
    <form onSubmit={form.submit}>
      <Observer>
        {() => (
          <div>
            <label htmlFor="email">Username</label>
            <input
              id="email"
              name="email"
              type="email"
              value={emailField.value}
              onChange={event => emailField.update(event.target.value)}
            />
            {(emailField.errors.length > 0) &&
              <ul>
                {emailField.errors.map(error => (
                  <li>{error.message}</li>
                ))}
              </ul>}
          </div>
        )}
      </Observer>
      
      <Observer>
        {() => (
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={passwordField.value}
              onChange={event => passwordField.update(event.target.value)}
            />
            {(passwordField.errors.length > 0) &&
              <ul>
                {passwordField.errors.map(error => (
                  <li>{error.message}</li>
                ))}
              </ul>}
          </div>
        )}
      </Observer>

      <button>Sign Up</button>
    </form>
  )
})

// Or using useForm + createFormStore, it adds some sugar

export const NativeForm2 = observer(() => {
  const [_, { Form, Field }] = useForm(() => createFormStore({
    schema: SignUpSchema,
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit(values) {
      window.alert(JSON.stringify(values))
    }
  }))

  return (
    <Form>
      <Field name="email">
        {field => (
          <div>
            <label htmlFor="email">Password</label>
            <input
              id="email"
              name="email"
              type="email"
              value={field.value}
              onChange={event => field.update(event.target.value)}
            />
            {(field.errors.length > 0) && 
              <ul>
                {field.errors.map(error =>
                  <li>{error.message}</li>)}
              </ul>}
          </div>
        )}
      </Field>

      <Field name="password">
        {field => (
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={field.value}
              onChange={event => field.update(event.target.value)}
            />
            {(field.errors.length > 0) && 
              <ul>
                {field.errors.map(error =>
                  <li>{error.message}</li>)}
              </ul>}
          </div>
        )}
      </Field>

      <button>Sign Up</button>
    </Form>
  )
})