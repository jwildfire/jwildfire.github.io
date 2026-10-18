// node --test   (from scripts/quick-hit/)
import test from "node:test";
import assert from "node:assert/strict";
import { cleanUrl, sourceFromUrl, slugify, dateParts, safeBody, buildFile, filePath, permalink, toBase64 } from "./lib.js";

const when = new Date(2026, 9, 18, 9, 5, 7); // 18 Oct 2026, 09:05:07 local

test("cleanUrl drops tracking parameters and highlight fragments, keeps the rest", () => {
  assert.equal(
    cleanUrl("https://ex.com/a?id=3&utm_source=x&utm_medium=y&fbclid=z#:~:text=hello"),
    "https://ex.com/a?id=3",
  );
  assert.equal(cleanUrl("https://ex.com/a#section-2"), "https://ex.com/a#section-2");
  assert.equal(cleanUrl("not a url "), "not a url");
});

test("sourceFromUrl is the host without www", () => {
  assert.equal(sourceFromUrl("https://www.newyorker.com/x"), "newyorker.com");
  assert.equal(sourceFromUrl("https://simonwillison.net/2026/"), "simonwillison.net");
  assert.equal(sourceFromUrl("nope"), "");
});

test("slugify makes short ASCII slugs", () => {
  assert.equal(slugify("Sam Altman May Control Our Future — Can He Be Trusted?"), "sam-altman-may-control-our-future-can-he-be-trusted");
  assert.equal(slugify("Café déjà vu: it's here"), "cafe-deja-vu-its-here");
  assert.equal(slugify("???"), "link");
  const long = slugify("word ".repeat(40));
  assert.ok(long.length <= 60 && !long.endsWith("-"), long);
});

test("dateParts gives the filename date and a timestamp with the local offset", () => {
  const { ymd, stamp } = dateParts(when);
  assert.equal(ymd, "2026-10-18");
  assert.match(stamp, /^2026-10-18 09:05:07 [+-]\d{4}$/);
});

test("safeBody guards Liquid and a leading heading", () => {
  assert.equal(safeBody("  plain  "), "plain");
  assert.equal(safeBody(""), "");
  assert.equal(safeBody("# Big idea"), "\\# Big idea");
  assert.equal(safeBody("use {{ page.title }}"), "{% raw %}use {{ page.title }}{% endraw %}");
  assert.ok(!safeBody("a {% endraw %} b").includes("{% endraw %} b"));
});

test("buildFile writes front matter that YAML reads back", () => {
  const file = buildFile({
    title: '  The "AI" thing:  part 2 ',
    link: "https://ex.com/a",
    source: "ex.com",
    quote: "Line one.\n\nLine two with a colon: yes.",
    comment: "Worth a read.",
    date: when,
  });
  const lines = file.split("\n");
  assert.equal(lines[0], "---");
  assert.equal(lines[1], 'title: "The \\"AI\\" thing: part 2"');
  assert.equal(lines[2], 'link: "https://ex.com/a"');
  assert.equal(lines[3], 'source: "ex.com"');
  assert.match(lines[4], /^date: 2026-10-18 09:05:07 [+-]\d{4}$/);
  assert.equal(lines[5], 'quote: "Line one.\\n\\nLine two with a colon: yes."');
  assert.equal(lines[6], "---");
  assert.ok(file.endsWith("\nWorth a read.\n"));
  assert.ok(!file.includes("published:"));
});

test("buildFile marks drafts unpublished and leaves out empty fields", () => {
  const file = buildFile({ title: "T", link: "https://ex.com", date: when, draft: true });
  assert.ok(file.includes("\npublished: false\n"));
  assert.ok(!file.includes("quote:"));
  assert.ok(!file.includes("source:"));
  assert.ok(file.endsWith("---\n"));
});

test("buildFile refuses a missing title or a non-web link", () => {
  assert.throws(() => buildFile({ title: " ", link: "https://ex.com" }), /title/);
  assert.throws(() => buildFile({ title: "T", link: "chrome://newtab" }), /link/);
});

test("filePath and permalink agree on the slug", () => {
  const a = filePath("Hello, World", when);
  assert.deepEqual(a, { path: "_links/2026-10-18-hello-world.md", slug: "hello-world" });
  assert.equal(filePath("Hello, World", when, 2).path, "_links/2026-10-18-hello-world-2.md");
  assert.equal(permalink("https://jwildfire.github.io/", when, a.slug), "https://jwildfire.github.io/links/2026/10/18/hello-world/");
});

test("toBase64 encodes UTF-8", () => {
  assert.equal(Buffer.from(toBase64("é — ✓"), "base64").toString("utf8"), "é — ✓");
});
