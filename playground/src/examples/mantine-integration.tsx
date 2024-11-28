import { observer, Observer } from 'mobx-react-lite'
import { useForm, createFormStore } from 'mobx-valibot-form'
import { TextInput, Button } from '@mantine/core'
import * as v from 'valibot'

const Schema = v.object({
  firstName: v.pipe(
    v.string(),
    v.nonEmpty()
  ),
  lastName: v.pipe(
    v.string(),
    v.nonEmpty()
  ),
  email: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.email()
  ),
  phone: v.nullish(
    v.pipe(
      v.string(),
      v.minLength(8),
      v.maxLength(15),
      v.regex(/^\d+$/)
    )
  ),
})

export const MantineIntegration = observer(() => {
  const [form, { Form, Field }] = useForm(() => createFormStore({
    schema: Schema,
    initialValues: {
      firstName: '',
      lastName: '',
      email: ''
    },
    onSubmit(values) {
      window.alert(JSON.stringify(values))
    }
  }))

  return (
    <Form noValidate>
      <Field name="firstName">
        {field => (
          <TextInput
            label="Name"
            onChange={event => field.update(event.target.value)}
          />
        )}
      </Field>

      <Field name="lastName">
        {field => (
          <TextInput
            label="Last name"
            onChange={event => field.update(event.target.value)}
          />
        )}
      </Field>

      <Field name="email">
        {field => (
          <TextInput
            type="email"
            label="Email"
            onChange={event => field.update(event.target.value)}
          />
        )}
      </Field>

      <Observer>
        {() => (
          <Button
            type="submit"
            loading={form.isSubmitting}
          >
            Send
          </Button>
        )}
      </Observer>
    </Form>
  )
})