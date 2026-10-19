# Contributing to QR Generator

Thanks for wanting to help. Bug reports, ideas, docs fixes and code are all welcome.

## Ways to contribute

- **Report a bug or suggest a feature:** [open an issue](https://github.com/Vigesh-VS/qr-generator/issues/new/choose).
- **Fix something or build something:** pick an issue labelled `good first issue`, or open one first so we can agree on the approach before you write code.
- **Report a security problem:** do not open a public issue. Follow [SECURITY.md](SECURITY.md).

## Set up

You need Node.js 20 or newer.

```bash
git clone https://github.com/Vigesh-VS/qr-generator.git
cd qr-generator
npm install
npm run dev        # http://localhost:8080
```

There is no backend and no environment variables to configure.

## Before you open a pull request

Run all of these. CI runs the same checks and a pull request can only be merged when they pass.

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Guidelines

- **Keep pull requests small and focused.** One change per pull request is easier to review.
- **Add or update tests** for any change in behaviour. The rules for what goes into a QR code live in `src/lib/qr.ts` and are covered by `src/lib/qr.test.ts`.
- **Keep the safety rules.** Text from a QR code is only ever shown as plain text on `/view` (never as HTML or a clickable link), input has length limits, and links containing a username or password are refused. Changes that loosen these need a clear reason in the pull request.
- **No new network requests, trackers or third-party scripts.** The app works entirely in the browser and the Content-Security-Policy in `vercel.json` blocks everything else. Keep it that way.
- **Write commit messages that say what changed and why** (for example `fix: refuse links with embedded credentials`).
- **Match the existing style.** `npm run lint` catches most of it.

## Code of Conduct

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
