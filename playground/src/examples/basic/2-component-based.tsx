import { useState } from 'react'
import { observer, Observer } from 'mobx-react-lite'
import { createFormStore, Form, Field } from 'mobx-valibot-form'
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

  return (
    <Form of={form}>
      <Field of={form} name="email">
        {field => (
          <div>
            <label htmlFor="email">Username</label>
            <input
              id="email"
              name="email"
              type="email"
              value={field.value}
              onChange={event => field.update(event.target.value)}
            />
            {(field.errors.length > 0) &&
              <ul>
                {field.errors.map(error => (
                  <li>{error.message}</li>
                ))}
              </ul>}
          </div>
        )}
      </Field>

      <Field of={form} name="password">
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
                {field.errors.map(error => (
                  <li>{error.message}</li>
                ))}
              </ul>}
          </div>
        )}
      </Field>

      <Observer>
        {() => (
          <button>
            {form.isSubmitting
              ? 'Submitting...'
              : 'Sign Up'}
          </button>
        )}
      </Observer>
    </Form>
  )
})