import * as v from 'valibot'
import type { GenericSchema } from 'valibot'


export function groupBy<T>(
  array: T[],
  fn: (item: T) => PropertyKey
) {
  const result = {} as Record<PropertyKey, T[]>
  array.forEach(item => {
    const key = fn(item)
    if (result.hasOwnProperty(key)) {
      result[key].push(item)
      return
    }

    result[key] = [item]
  })
  return result
}

export async function parseSchema(
  input: unknown,
  schema: GenericSchema = v.any()
) {
  const {
    success: isValid,
    issues = [],
    output,
  } = await v.safeParseAsync(schema, input)

  const errors = issues.map(issue => ({
    type: issue.type,
    message: issue.message,
    valibotIssue: issue
  }))

  return {
    isValid,
    errors,
    output
  }
}