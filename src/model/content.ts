import * as t from 'io-ts'

const Content = t.exact(
  t.type({
    name: t.string,
    path: t.string,
    sha: t.string,
    size: t.number,
    type: t.string,
    content: t.string,
    encoding: t.string,
  }),
)

export const GetContentResponse = t.exact(
  t.type({
    data: Content,
  }),
)

export type IGetContentResponse = t.TypeOf<typeof GetContentResponse>
