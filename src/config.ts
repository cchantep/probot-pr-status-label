import { Context } from 'probot'

import * as t from 'io-ts'
import { none, some, Option } from 'fp-ts/lib/Option'

import * as util from './util'

import { CommitState } from './model/pullrequest'

// ---

import { GetContentResponse, IGetContentResponse } from './model/content'

function getContent(bot: Context, path: string, ref: string): Promise<IGetContentResponse> {
  return bot.github.repos
    .getContents(bot.repo({ path, ref }))
    .then(payload => util.fromEither(GetContentResponse.decode(payload)))
}

// ---

import dc from './resources/pr-status-label.json'

export const Config = t.exact(
  t.type({
    requiredStatusRegex: t.string,
    pendingStatusRegex: t.string,
    successStatusRegex: t.string,
    errorStatusRegex: t.string,
  }),
)

export type IConfig = t.TypeOf<typeof Config>

export const DefaultConfig: IConfig = dc as IConfig

type Enc =
  | 'ascii'
  | 'utf8'
  | 'utf-8'
  | 'utf16le'
  | 'ucs2'
  | 'ucs-2'
  | 'base64'
  | 'latin1'
  | 'binary'
  | 'hex'
  | undefined

export type LabelStatus = {
  context: string,
  commitState: CommitState,
  internalState: CommitState | 'required'
}

// ---

export function matchStatus(input: string, c: IConfig): Option<LabelStatus> {
  return _matchStatus(input, c.successStatusRegex)
    .map(s => {
      const res: LabelStatus = {
        context: s,
        commitState: 'success',
        internalState: 'success'
      }

      return res
    })
    .orElse(() => _matchStatus(input, c.requiredStatusRegex).map(s => {
      return { context: s, commitState: 'pending', internalState: 'required' }
    }))
    .orElse(() => _matchStatus(input, c.pendingStatusRegex).map(s => {
      return { context: s, commitState: 'pending', internalState: 'pending' }
    }))
    .orElse(() => _matchStatus(input, c.errorStatusRegex).map(s => {
      return { context: s, commitState: 'error', internalState: 'error' }
    }))
}

export function _matchStatus(input: string, re: string): Option<string> {
  const m = input.match(re)

  return !m || m.length != 2 ? none : some(m[1])
}

// ---

function getFromJson(bot: Context, path: string, ref: string): Promise<{}> {
  return getContent(bot, path, ref).then(resp => {
    const buff = Buffer.from(resp.data.content, resp.data.encoding as Enc)

    return JSON.parse(buff.toString('ascii'))
  })
}

// TODO: Fallback to DefaultConfig (or Option)
export function getConfig(bot: Context, ref: string): Promise<IConfig> {
  return getFromJson(bot, '.github/pr-status-label.json', ref)
    .then(json => util.fromEither(Config.decode(json)))
    .then(
      decoded => decoded,
      err => {
        bot.log.debug(`Fails to load configuration from branch '${ref}'`, err)

        return DefaultConfig
      },
    )
}
