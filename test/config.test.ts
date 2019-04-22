import { IConfig, Config, DefaultConfig, matchStatus, _matchStatus } from '../src/config'

import { CommitState } from '../src/model/pullrequest'

// Fixtures
import config from '../src/resources/pr-status-label.json'

describe('Configuration', () => {
  test('Decode configuration from JSON', () => {
    expect(Config.decode(config)).toEqual({
      _tag: 'Right',
      value: DefaultConfig,
    })
  })

  test('Match status using {success, pending, error}StatusRegex', () => {
    const r1 = _matchStatus(':foo: review:ok', DefaultConfig.successStatusRegex)
    const r2 = _matchStatus(':bar: review:success', DefaultConfig.successStatusRegex)
    const r3 = _matchStatus(':lorem: qa:pending', DefaultConfig.pendingStatusRegex)
    const r4 = _matchStatus(':ipsum: design:error', DefaultConfig.errorStatusRegex)
    const r5 = _matchStatus(':dolor: design:ko', DefaultConfig.errorStatusRegex)
    const r6 = _matchStatus('review:success', DefaultConfig.errorStatusRegex)

    expect(r1.exists(s => s == 'review')).toEqual(true)
    expect(r2.exists(s => s == 'review')).toEqual(true)
    expect(r3.exists(s => s == 'qa')).toEqual(true)
    expect(r4.exists(s => s == 'design')).toEqual(true)
    expect(r5.exists(s => s == 'design')).toEqual(true)

    expect(r6.isNone()).toEqual(true)
  })

  test('Match success status', () => {
    const r1 = matchStatus(':foo: review:ok', DefaultConfig)
    const r2 = matchStatus(':bar: review:success', DefaultConfig)
    const expected: [CommitState, string] = ['success', 'review']

    expect(r1.toUndefined()).toEqual(expected)
    expect(r2.toUndefined()).toEqual(expected)
  })

  test('Match pending status', () => {
    const r3 = matchStatus(':lorem: qa:pending', DefaultConfig)

    expect(r3.toUndefined()).toEqual(['pending', 'qa'])
  })

  test('Match error status', () => {
    const r4 = matchStatus(':ipsum: design:error', DefaultConfig)

    expect(r4.toUndefined()).toEqual(['error', 'design'])
  })
})
