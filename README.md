# npmjs

An npm package demo template: TypeScript source in `src/`, `bun` for install / build, published as ESM + CJS, one output directory each, with type declarations for both.

## Setup

```bash
bun install
```

## Develop

```bash
bun run typecheck   # tsc --noEmit (no emit, so a dry run)
bun run build       # clean dist, build ESM + CJS, copy the type markers
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
`"type": "module"` — so the build copies `{esm,cjs}.package.json` from the repo root into each
output directory to mark it. That step is why the build is not purely config-driven.

`prepack` typechecks and builds before packing or publishing.

## Use

```ts
import { greet } from "npmjs";   // ESM
const { greet } = require("npmjs"); // CJS
```

## `package.json` reference

JSON has no comments, so the fields are explained here. The `tsconfig` files carry
their own inline comments.

### Identity

| Field | Meaning |
| --- | --- |
| `name` | Registry name and import specifier. Unscoped names must be unique on npm. |
| `version` | Semver. npm rejects a version that was already published. |
| `description` | One line for npm search and the package page. |
| `keywords` | Search terms. |
| `license` | SPDX identifier; keep `LICENSE` in sync. |
| `author` / `contributors` | Who wrote it. `contributors` is optional; delete it if empty. |
| `homepage` / `repository` / `bugs` | Where users read docs, browse source and file issues. |
| `funding` | Sponsor link shown on the package page. Delete if unused. |

### Entry points

| Field | Meaning |
| --- | --- |
| `type: "module"` | Root `.js` files are ESM. `dist/{esm,cjs}/package.json` override this per folder. |
| `main` | CJS entry for tooling too old to read `exports`. |
| `module` | ESM entry, a bundler convention (not a Node field). |
| `types` | TypeScript entry for tooling too old to read `exports`. |
| `exports` | The real entry map. `import` → ESM, `require` → CJS, `types` first in each. Unlisted paths are unreachable. |
| `sideEffects: false` | Bundlers may drop unused imports; set only if modules truly have no side effects. |

### Packed contents

| Field | Meaning |
| --- | --- |
| `files` | Whitelist of what `npm pack` includes. `package.json`, `README.md` and `LICENSE` are always added. |

### Scripts

| Script | Meaning |
| --- | --- |
| `clean` | Delete `dist`. |
| `build` | `clean`, then both formats, then the format markers (one command, no separate steps). |
| `typecheck` | `tsc --noEmit` over the base config. |
| `prepack` | Runs before `npm pack` / `npm publish`; typechecks and builds, so `dist` is never stale. |

### Runtime and publishing

| Field | Meaning |
| --- | --- |
| `engines` | Minimum Node for consumers (`>=20`) and Bun for contributors. npm warns, it does not enforce. |
| `packageManager` | Exact Bun version; corepack/Bun switch to it automatically. |
| `publishConfig.access` | `public` is required for scoped packages, harmless for unscoped. |
| `devDependencies` | Build-only packages; never installed by consumers. |

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
