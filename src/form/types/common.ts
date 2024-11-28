export type AnyObject = Record<PropertyKey, any>
export type AnyArray = any[]
export type AnyPair = Pair<any, any>

export type Pair<K extends string, V> = [key: K, value: V]
export type FromPairs<T extends Pair<string, unknown>[]> = { [P in T[number] as P[0]]: P[1] }

type Match<
  T,
  C0 extends AnyPair,
  C1 extends AnyPair,
  C2 extends AnyPair = never,
  C3 extends AnyPair = never,
  C4 extends AnyPair = never,
  C5 extends AnyPair = never,
  C6 extends AnyPair = never,
  C7 extends AnyPair = never,
> = T extends C0[0] ? C0[1] :
    T extends C1[0] ? C1[1] :
    T extends C2[0] ? C2[1] :
    T extends C3[0] ? C3[1] :
    T extends C4[0] ? C4[1] :
    T extends C5[0] ? C5[1] :
    T extends C6[0] ? C6[1] :
    T extends C7[0] ? C7[1] : never

type IsNever<T> = [T] extends [never] ? true : false
type IsUnion<T, U = T> = T extends any ? ([U] extends [T] ? false : true) : never

type Primitive = string | number | boolean | symbol | null | undefined
type BuiltInClass = Date | RegExp | File

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7]

export type ToAllPossiblePairs<
  T,
  TPrefix extends string = '',
  TDepth extends Prev[number] = 7
> = 
  IsNever<TDepth> extends true ? never :
  IsUnion<T> extends true ? never :
  Match<
    T,
    [Primitive, never],
    [BuiltInClass, never],
    [AnyArray, {
      [TIndex in keyof T & number]:
        | Pair<`${TPrefix}[${TIndex}]`, T[TIndex]>
        | ToAllPossiblePairs<
            T[TIndex],
            T[TIndex] extends AnyArray
              ? `${TPrefix}[${TIndex}]`
              : `${TPrefix}[${TIndex}].`,
            Prev[TDepth]
          >[number]
    }[keyof T & number]],
    [AnyObject, {
      [TKey in keyof T & string]-?:
        | Pair<`${TPrefix}${TKey}`, T[TKey]>
        | ToAllPossiblePairs<
            T[TKey],
            T[TKey] extends AnyArray
              ? `${TPrefix}${TKey}`
              : `${TPrefix}${TKey}.`,
            Prev[TDepth]
          >[number]
    }[keyof T & string]]
  >[]