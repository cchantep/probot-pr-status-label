import * as t from 'io-ts'

export type CommitState = 'success' | 'error' | 'failure' | 'pending'

export const UserInfo = t.exact(
  t.type({
    login: t.string,
  }),
)

const BranchInfo = t.exact(
  t.type({
    label: t.string,
    ref: t.string,
    sha: t.string,
  }),
)

export const Label = t.exact(
  t.type({
    name: t.string,
  }),
)

export const PullRequestInfo = t.exact(
  t.type({
    number: t.number,
    html_url: t.string, // TODO: url
    state: t.string, // TODO: enum
    title: t.string,
    user: UserInfo,
    base: BranchInfo,
    head: BranchInfo,
    labels: t.array(Label),
  }),
)

export type IPullRequestInfo = t.TypeOf<typeof PullRequestInfo>

// --- Events

const RepoInfo = t.exact(
  t.type({
    id: t.number,
    name: t.string,
    owner: UserInfo,
  }),
)

const prEventBase = {
  pull_request: PullRequestInfo,
  repository: RepoInfo,
  sender: UserInfo
}

export const PullRequestEvent = t.exact(t.type(prEventBase))

export type IPullRequestEvent = t.TypeOf<typeof PullRequestEvent>

export const PullRequestLabelEvent = t.exact(
  t.type({
    ...prEventBase,
    label: Label,
  }),
)

export type IPullRequestLabelEvent = t.TypeOf<typeof PullRequestLabelEvent>
