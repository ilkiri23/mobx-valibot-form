import { useId, type InputHTMLAttributes } from 'react'
import { observer, Observer } from 'mobx-react-lite'
import { useForm, createFormStore } from 'mobx-valibot-form'
import * as v from 'valibot'

type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> & {
  label: string
  value: string
  onChange: (value: string) => void
  errorMessage?: string
}

function TextInput(props: TextInputProps) {
  const { label, errorMessage, onChange, ...otherProps } = props
  const id = useId()
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        {...otherProps}
        id={id}
        onChange={event => onChange(event.target.value)} 
      />
      {errorMessage !== undefined
        && <div>{errorMessage}</div>}
    </div>
  )
}

const UsersSchema = v.object({
  users: v.array(v.object({
    id: v.string(),
    name: v.string(),
    email: v.pipe(v.string(), v.email())
  }))
})

export const FormWithDynamicFields = observer(() => {
  const [form, { Form, Field }] = useForm(() => createFormStore({
    schema: UsersSchema,
    initialValues: {
      users: []
    }
  }))

  function addUser() {
    const id = Math.random().toString(16).slice(2)
    form.update('users', [...form.values.users, { id, name: '', email: '' }])
  }

  function removeUser(id: string) {
    form.update('users', form.values.users.filter(user => user.id !== id))
  }

  return (
    <Form>
      <button
        type="button"
        onClick={addUser}
      >
        + Add User
      </button>
      
      <Observer>
        {() => (
          <ol>
            {form.values.users.map((user, index) => (
              <li key={user.id}>
                ID: {user.id}

                <Field name={`users[${index}].name`}>
                  {field => (
                    <TextInput
                      label="Name"
                      value={field.value}
                      errorMessage={field.errors[0]?.message}
                      onChange={field.update}
                    />
                  )}
                </Field>

                <Field name={`users[${index}].email`}>
                  {field => (
                    <TextInput
                      label="Email"
                      value={field.value}
                      errorMessage={field.errors[0]?.message}
                      onChange={field.update}
                    />
                  )}
                </Field>

                <button
                  type="button"
                  onClick={() => removeUser(user.id)}
                >
                  – Remove
                </button>
              </li>
            ))}
          </ol>
        )}
      </Observer>

      <button>Submit</button>
    </Form>
  )
})