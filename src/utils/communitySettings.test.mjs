// node src/utils/communitySettings.test.mjs
//
// resolveCommunity is pure, but its module imports firebase.config, which reads
// Vite's import.meta.env and blows up outside the bundler. So we load the file
// with its import lines stripped rather than mocking the SDK.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const src = await readFile(new URL("./communitySettings.js", import.meta.url), "utf8");
const { resolveCommunity, FALLBACK_LINKS, DEFAULT_CLOSED_MESSAGE, ABSENT_DOC, READ_FAILED } =
  await import(
  "data:text/javascript," + encodeURIComponent(src.replace(/^import .*$/gm, ""))
);

// the two no-data paths must stay opposite
assert.equal(resolveCommunity(ABSENT_DOC).open, false, "no doc yet => joining closed");
assert.equal(resolveCommunity(READ_FAILED).open, true, "a failed read must not fake a closure");
// an existing doc says what it says; a doc without the field stays open
assert.equal(resolveCommunity({ open: true }).open, true);
assert.equal(resolveCommunity({ open: false }).open, false);
assert.equal(resolveCommunity({ links: {} }).open, true);

// junk written from the Firestore console can't reach the UI
const j = resolveCommunity({ links: { Biotechnology: null, "Civil Engineering": "  " } });
assert.equal(j.links.Biotechnology, FALLBACK_LINKS.Biotechnology);
assert.equal(j.links["Civil Engineering"], FALLBACK_LINKS["Civil Engineering"]);

// links merge over the seed instead of replacing it
const r = resolveCommunity({ links: { Biotechnology: "https://chat.whatsapp.com/NEW" } });
assert.equal(r.links.Biotechnology, "https://chat.whatsapp.com/NEW");
assert.equal(
  r.links["Mechanical Engineering"],
  FALLBACK_LINKS["Mechanical Engineering"],
  "branches absent from Firestore must keep their seed link, not become undefined"
);
assert.equal(Object.keys(r.links).length, Object.keys(FALLBACK_LINKS).length);

// closed message falls back when absent or blank
assert.equal(resolveCommunity(null).closedMessage, DEFAULT_CLOSED_MESSAGE);
assert.equal(resolveCommunity({ closedMessage: "   " }).closedMessage, DEFAULT_CLOSED_MESSAGE);
assert.equal(resolveCommunity({ closedMessage: "ping us" }).closedMessage, "ping us");

console.log("communitySettings: all assertions passed");
