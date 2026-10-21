# npmjs

An npm package demo template: TypeScript source in `src/`, `bun` for install / test / build, published as ESM + CJS, one output directory each, with type declarations for both.

## Setup

```bash
bun install
```

## Develop

```bash
bun test            # tests in src/
bun run test:dist   # build, then test the output in dist/ (ESM + CJS)
bun run typecheck   # tsc --noEmit
bun run build       # clean dist, then tsc -p tsconfig.esm.json && tsc -p tsconfig.cjs.json
```

Source lives in `src/`, entry point `src/index.ts`. Import sibling files with a `.js`
extension (`import { x } from "./util.js"` even though the file is `util.ts`) — the
specifier is copied verbatim into the emitted `.d.ts`.

`bun run build` first deletes `dist` (so removed sources cannot leave stale output
behind), then runs one tsc config per module format:

| Config | Output | For |
| --- | --- | --- |
| `tsconfig.esm.json` | `dist/esm/index.js` + `index.d.ts` | ESM (`import`) |
| `tsconfig.cjs.json` | `dist/cjs/index.js` + `index.d.ts` | CJS (`require`) |

Node picks the format from the nearest `package.json`, and the root one says
`"type": "module"` — so `build:markers` copies `build/{esm,cjs}.package.json` into each
output directory to mark it. That step is why the build is not purely config-driven.

`prepack` builds before packing, `prepublishOnly` runs typecheck and tests before publishing.

## Use

```ts
import { greet } from "npmjs";   // ESM
const { greet } = require("npmjs"); // CJS
```

## Publish

```bash
bun publish
```

`files` limits the tarball to `dist`; `README.md`, `LICENSE` and `package.json` are always included.

## Before publishing

Change these in `package.json`:

| Field | What to put there |
| --- | --- |
| `name` | Your package name. Unscoped names must be unique on npm; scoped (`@you/npmjs`) if unsure. |
| `version` | Start at `1.0.0` for a real release (semver). npm rejects a version that already exists. |
| `description` | One line shown in npm search results. |
| `keywords` | Search terms. |
| `homepage` / `repository` / `bugs` | Your repo URLs. |
| `author` | Your name, email, site. |
| `contributors` | Co-authors; delete the field if there are none. |
| `funding` | Sponsorship link; delete if unused. |
| `license` | SPDX id. Keep `LICENSE` in sync. |
| `engines.node` | Minimum Node your code supports. |

Also rename `npmjs` in `LICENSE` (the copyright holder).
