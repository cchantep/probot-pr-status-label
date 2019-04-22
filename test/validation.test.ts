import * as t from 'io-ts'

import { IPullRequestInfo, PullRequestLabelEvent, IPullRequestLabelEvent } from '../src/model/pullrequest'
import { GetContentResponse, IGetContentResponse } from '../src/model/content'

import { DefaultConfig } from '../src/config'

// Fixtures
import content from './fixtures/content.json' // TODO
import prLabeled from './fixtures/pull_request.labeled.json'
import pr from './fixtures/pr.json'

describe('Validation', () => {
  const prInfo: IPullRequestInfo = {
    number: 1,
    html_url: 'https://github.com/cchantep/mal/pull/1',
    state: 'open',
    title: 'Update README.md',
    user: {
      login: 'cchantep',
    },
    base: {
      label: 'cchantep:master',
      ref: 'master',
      sha: 'b020aa3e770fb2e3528bb52f4372c13e039fcae9',
    },
    head: {
      label: 'cchantep:cchantep-patch-1',
      ref: 'cchantep-patch-1',
      sha: '64936fdf1aeeb37309d09875c5b6973afecb41ee',
    },
    labels: [{ name: 'duplicate' }],
  }

  // ---

  test('Decode pull_request.labeled JSON payload', () => {
    const expected: IPullRequestLabelEvent = {
      pull_request: prInfo,
      repository: {
        id: 32572417,
        name: 'mal',
        owner: {
          login: 'cchantep',
        },
      },
      sender: {
        login: 'cchantep',
      },
      label: {
        name: 'duplicate',
      },
    }

    expect(PullRequestLabelEvent.decode(prLabeled)).toEqual({
      _tag: 'Right',
      value: expected,
    })
  })
})
