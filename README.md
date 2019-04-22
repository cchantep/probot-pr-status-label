# pr-status-label

A GitHub App built with [Probot](https://github.com/probot/probot) that Probot app that sets pull request statuses according labels.

## Usage

Add a label matching a status expression (see [*Configuration*](#configuration); e.g. ':ok_hand: review:ok').

![CircleCI](./docs/usage.gif)

### Configuration

On repository for which the application is installed,
a file named [`pr-status-label.json`](./src/resources/pr-status-label.json) can be defined on the base branches, in a `.github` directory at root. Default:

```json
{
  "successStatusRegex": "^:[^:]+: ([^:]+):(?:ok|success)$",
  "pendingStatusRegex": "^:[^:]+: ([^:]+):pending$",
  "errorStatusRegex": "^:[^:]+: ([^:]+):(ko|error)$"
}
```

- `successStatusRegex`: Detects a label as a success status; Starts with an emoji code, followed after a space by a status (capture group), and finally after a `:` separator either `ok` or `success` (e.g. `:ok_hand: review:ok`).
- `pendingStatusRegex`: Detects a label as a pending status (e.g. `:eyes: review:pending`).
- `errorStatusRegex`: Detects a label as an error (e.g. `:flushed: review:ko`)

## Build

```sh
# Install dependencies
npm install

# Run typescript
npm run build

# Run the bot
npm start
```

[![CircleCI](https://circleci.com/gh/cchantep/probot-pr-status-label.svg?style=svg)](https://circleci.com/gh/cchantep/probot-pr-status-label)

## Contributing

If you have suggestions for how pr-status-label could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 [Cédric Chantepie](https://github.com/cchantep/probot-pr-status-label)
