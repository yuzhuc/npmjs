import { expect, test } from "bun:test";
import { createRequire } from "node:module";

// Built output, not src: these catch things src tests cannot (bad exports paths,
// wrong package.json "type" marker, CJS interop).
test("esm build", async () => {
  const { greet } = await import("../dist/esm/index.js");
  expect(greet("esm")).toBe("Hello, esm!");
});

test("cjs build", () => {
  const { greet } = createRequire(import.meta.url)("../dist/cjs/index.js");
  expect(greet("cjs")).toBe("Hello, cjs!");
});
