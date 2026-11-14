import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

describe("jsr.json", () => {
  it("matches package.json version and JSR package name", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const jsr = JSON.parse(readFileSync(join(root, "jsr.json"), "utf8"));
    expect(jsr.name).toBe("@paladini/intervals-icu");
    expect(jsr.version).toBe(pkg.version);
    expect(jsr.exports["."]).toBe("./src/index.ts");
    expect(pkg.name).toBe("intervals-icu");
  });
});