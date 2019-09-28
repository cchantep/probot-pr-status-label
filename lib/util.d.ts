import { Either } from 'fp-ts/lib/Either';
import { Errors } from 'io-ts';
export declare function fromEither<T>(e: Either<Errors, T>): Promise<T>;
