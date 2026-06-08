import assert from "node:assert/strict";
import test from "node:test";

import { isTrustedOrigin, normalizeDomain } from "@/lib/domain";

test("normalizes common domain input", () => {
  assert.equal(normalizeDomain(" HTTPS://WWW.Example.COM/path "), "www.example.com");
  assert.equal(normalizeDomain("example.com"), "example.com");
  assert.equal(normalizeDomain("example.com."), "example.com");
});

test("rejects invalid production domains", () => {
  assert.equal(normalizeDomain("localhost"), null);
  assert.equal(normalizeDomain("bad_domain.com"), null);
  assert.equal(normalizeDomain("not-a-host"), null);
});

test("allows localhost when explicitly enabled", () => {
  assert.equal(normalizeDomain("localhost:3000", { allowLocalhost: true }), "localhost");
});

test("matches exact domains and subdomains", () => {
  assert.equal(isTrustedOrigin("https://example.com/page", "example.com"), true);
  assert.equal(isTrustedOrigin("https://app.example.com", "example.com"), true);
  assert.equal(isTrustedOrigin("https://badexample.com", "example.com"), false);
});
