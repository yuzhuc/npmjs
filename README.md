# npmjs

An npm package demo template: TypeScript source in `src/`, `bun` for install / build, published as ESM + CJS, one output directory each, with type declarations for both.

## Setup

```bash
bun install
```

## Develop

```bash
bun run typecheck   # tsc --noEmit
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
`"type": "module"` — so the build copies `{esm,cjs}.package.json` from the repo root
into each output directory to mark it. That step is why the build is not purely
config-driven.

`prepack` typechecks and builds before packing or publishing.

## Use

```ts
import { greet } from "npmjs";   // ESM
const { greet } = require("npmjs"); // CJS
```

## `package.json` reference

JSON has no comments, so the fields are explained here. The `tsconfig` files carry
comments where a setting needs one.

### Identity

| Field | Meaning |
| --- | --- |
| `name` | Registry name and import specifier. Unscoped names must be unique on npm. |
| `version` | Semver. npm rejects a version that was already published. |
| `description` | One line for npm search and the package page. |
| `keywords` | Search terms. |
| `license` | SPDX identifier; keep `LICENSE` in sync. |
| `author` | Who wrote it. |
| `homepage` / `repository` / `bugs` | Where users read docs, browse source and file issues. |

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

Publishing runs in CI (`.github/workflows/publish.yml`), triggered by publishing a
GitHub Release or starting the workflow manually. It runs:

```bash
npm publish --provenance --access public
```

Requirements:

- `NPM_TOKEN` in the repository secrets.
- `repository.url` in `package.json` must match the GitHub repo, or provenance fails.
  Provenance needs GitHub's OIDC token, so a local `npm publish` cannot do it.

`files` limits the tarball to `dist`.

`LICENSE` must name the actual copyright holder; it is not covered by `files`.
