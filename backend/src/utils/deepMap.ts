/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import _ from 'lodash'
type ReplaceFn = ({
  path,
  key,
  value,
}: {
  path: string
  key: string
  value: Value
}) => Value
type Value =
  | object
  | number
  | string
  | boolean
  | null
  | undefined
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function
  | symbol
  | any[]

export const deepMap = <T = Value>(input: Value, replaceFn: ReplaceFn): T => {
  const recursion = ({
    input,
    replaceFn,
    seen,
    pathStartsWith,
    parentKey,
  }: {
    input: Value
    replaceFn: ReplaceFn

    seen: WeakSet<any>
    pathStartsWith: string
    parentKey: string
  }): Value => {
    if (['object', 'function', 'symbol'].includes(typeof input) && input !== null) {
      if (seen.has(input)) {
        return '[Circular]'
      } else {
        seen.add(input)
      }
    }
    const result = replaceFn({
      path: pathStartsWith.replace(/^\./, ''),
      key: parentKey,
      value: input,
    })
    if (!result) {
      return result
    }
    if (_.isArray(result)) {
      return result.map((item, index) =>
        recursion({
          input: item,
          replaceFn,
          seen,
          pathStartsWith: `${pathStartsWith}${index}.`,
          parentKey: String(index),
        }),
      )
    }
    if (_.isObject(result)) {
      const object: any = {}
      for (const [key, value] of Object.entries(result)) {
        object[key] = recursion({
          input: value,
          replaceFn,
          seen,
          pathStartsWith: `${pathStartsWith}${key}.`,
          parentKey: key,
        })
      }
      return object
    }
    return result
  }

  const seen = new WeakSet()
  const mappedObject = recursion({
    input,
    replaceFn,
    seen,
    pathStartsWith: '',
    parentKey: '',
  })
  const clonedMappedObject = _.cloneDeep(mappedObject)
  return clonedMappedObject as T
}
