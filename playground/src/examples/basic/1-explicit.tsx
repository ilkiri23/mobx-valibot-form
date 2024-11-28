import { useState } from 'react'
import { observer, Observer } from 'mobx-react-lite'
import { createFormStore } from 'mobx-valibot-form'
import * as v from 'valibot'

const SignUpSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8))
})

export const MVFForm = observer(() => {
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

      <Observer>
        {() => (
          <button>
            {form.isSubmitting
              ? 'Submitting...'
              : 'Sign Up'}
          </button>
        )}
      </Observer>
    </form>
  )
})