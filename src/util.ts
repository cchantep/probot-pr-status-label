import { Either } from 'fp-ts/lib/Either'
import { Errors } from 'io-ts'

export function fromEither<T>(e: Either<Errors, T>): Promise<T> {
  return e.fold(cause => Promise.reject(new Error(JSON.stringify(cause))), res => Promise.resolve(res))
}
