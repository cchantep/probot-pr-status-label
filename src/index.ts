import { Application, Context } from 'probot'

import * as t from 'io-ts'
import { none, some, Option } from 'fp-ts/lib/Option'

import * as util from './util'
import { CommitState, PullRequestEvent, PullRequestLabelEvent } from './model/pullrequest'
import { getConfig, matchStatus } from './config'

type CommitStatus = {
  state: CommitState
  description: string
  context: string
}

export = (app: Application) => {
  app.on('pull_request.labeled', async context => {
    const event = await util.fromEither(PullRequestLabelEvent.decode(context.payload))

    context.log.debug('Event:', event)

    const pr = event.pull_request

    if (pr.state != 'open') {
      return context.log.debug(`Skip label event on closed pull request #${pr.number}`)
    }

    const config = await getConfig(context, pr.base.ref)

    context.log('Config:', config)

    // TODO: Check there is no other label matching expr of other state
    // otherwise add warning as comment

    await matchStatus(event.label.name, config).fold(
      Promise.resolve(context.log(`Label '${event.label.name}' doesn't match status expressions`, config)),
      ls => {
        context.log(
          `Toggle ${ls.context} to ${ls.commitState} (${ls.internalState}) on pull request #${pr.number} @ ${
            pr.head.sha
          }`,
        )

        const description =
          ls.internalState != 'required'
            ? event.sender.login
            : 'Waiting for someone to check it ...' /* TODO: get label description + config */

        return toggleState(context, ls.context, pr.head.sha, ls.commitState, description)
      },
    )
  })

  app.on('pull_request.synchronize', async context => {
    const event = await util.fromEither(PullRequestEvent.decode(context.payload))

    context.log.debug('Event:', event)

    const pr = event.pull_request
    const config = await getConfig(context, pr.base.ref)
    const statuses: ReadonlyArray<CommitStatus> = await context.github.repos
      .listStatusesForRef(context.repo({ ref: pr.head.ref }))
      .then(resp => resp.data.map(st => st as CommitStatus))

    const statusLabels: ReadonlyArray<CommitStatus> = pr.labels
      .map(label =>
        matchStatus(label.name, config).fold(new Array<CommitStatus>(), m => {
          const found = statuses.find(st => m.commitState == st.state && m.context == st.context)

          return !!found ? [found] : []
        }),
      )
      .reduce((acc, v) => acc.concat(v), [])

    statusLabels.forEach(async st => {
      context.log(`Reset ${st.context} to ${st.state} on pull request #${pr.number} @ ${pr.head.sha}`)

      await toggleState(context, st.context, pr.head.sha, st.state, st.description)
    })
  })
}

// ---

function toggleState(
  bot: Context,
  statusContext: string,
  sha: string,
  expectedState: CommitState,
  msg: string,
): Promise<void> {
  return getCommitState(bot, sha, statusContext).then(state => {
    const alreadySet = state.filter(s => s == expectedState)

    if (!alreadySet) {
      return Promise.resolve()
    } else {
      return bot.github.repos
        .createStatus(
          bot.repo({
            sha: sha,
            context: statusContext,
            state: expectedState,
            description: msg,
          }),
        )
        .then(_r => Promise.resolve())
    }
  })
}

function getCommitState(bot: Context, ref: string, ctx: string): Promise<Option<string>> {
  return bot.github.repos.listStatusesForRef(bot.repo({ ref })).then(resp => {
    const found = resp.data.find(s => s.context == ctx)

    if (!found) {
      return Promise.resolve(none)
    } else {
      return Promise.resolve(some(found.state))
    }
  })
}
