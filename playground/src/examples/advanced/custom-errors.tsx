import { observer, Observer } from 'mobx-react-lite'
import { createFormStore, useForm } from 'mobx-valibot-form'
import * as v from 'valibot'
import type { InferInput } from 'valibot'

type SignUpError = {
  email?: string,
  password?: string
}

const SignUpSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8))
})


function signUp(_: InferInput<typeof SignUpSchema>) {
  const reason: SignUpError = {}
  
  if (Math.random() > 0.5) {
    reason.email = 'An account with this email address already exists'
  }

  return Promise.reject({
    email: 'An account with this email address already exists',
    password: 'Sorry, the password should be more complex'
  })
}

export const FormWithCustomErrors = observer(() => {
  const [form, { Form, Field }] = useForm(() => createFormStore({
    schema: SignUpSchema,
    initialValues: {
      email: '',
      password: ''
    },
    async onSubmit(values, methods) {
      try {
        const _ = await signUp(values)
      } catch (err) {
        const error = err as SignUpError

        if (error.email)
          methods.addError('email', {
            type: 'from_server',
            message: error.email
          })

        if (error.password)
          methods.addError('password', {
            type: 'from_server',
            message: error.password
          })
      }
    }
  }))

  return (
    <Form>
      <Field name="email">
        {field => (
          <div>
            <label htmlFor="email">Email</label>
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
                  <li key={error.type}>{error.message}</li>)}
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
                  <li key={error.type}>{error.message}</li>)}
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