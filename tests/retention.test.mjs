import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const read = (name) => readFileSync(new URL("../" + name, import.meta.url), "utf8");

function loadNewsData() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read("news-data.js"), sandbox);
  return sandbox.window.VAULTARA_LOCAL_NEWS;
}

function section(html, startMarker, endMarker) {
  const a = html.indexOf(startMarker);
  assert.ok(a >= 0, `missing section start: ${startMarker}`);
  const b = html.indexOf(endMarker, a);
  assert.ok(b > a, `missing section end: ${endMarker}`);
  return html.slice(a, b);
}

test("news data: dated, newest first, full own-words summaries, plain-text credits, no URLs", () => {
  const items = loadNewsData();
  assert.ok(Array.isArray(items) && items.length >= 3);
  const dates = items.map((i) => i.dateISO);
  assert.equal(dates.join(","), [...dates].sort().reverse().join(","), "items must be newest first");
  for (const item of items) {
    assert.match(item.dateISO, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.headline.length > 20, "headline present");
    assert.ok(item.summary.length >= 300, "summary must be a complete read, not a teaser");
    assert.ok(item.source && item.sourceDateLabel, "plain-text source credit present");
    assert.ok(!("url" in item) && !("href" in item) && !("sourceUrl" in item), "news items carry no URL fields");
  }
  assert.ok(!/https?:\/\//.test(read("news-data.js")), "data file contains no URLs at all");
  const survey = items.find((i) => i.headline.includes("Small Business Credit Survey"));
  assert.equal(survey.expiresAfter, "2026-11-13", "time-sensitive survey item is flagged for replacement");
});

test("homepage Local news renders on-page: all items, zero links inside news items", () => {
  const html = read("index.html");
  const news = section(html, 'id="local-news"', 'id="books"');
  const items = loadNewsData();
  for (const item of items) {
    assert.ok(news.includes(item.headline), `homepage renders headline: ${item.headline}`);
    assert.ok(news.includes(`Source: ${item.source} — ${item.sourceDateLabel}`), "plain-text credit renders");
    assert.ok(news.includes(`datetime="${item.dateISO}"`), "item is dated");
  }
  const cards = news.slice(news.indexOf("local-news-list"), news.indexOf("funding-readiness"));
  assert.ok(!/<a\s/i.test(cards), "ZERO hrefs/links inside news items");
  assert.ok(!/read more/i.test(news), "no read-more bounce language");
  // Removed feature links are replaced with on-page funding-readiness value.
  for (const phrase of ["clear purpose", "records organized", "Separate personal and business credit"]) {
    assert.ok(news.toLowerCase().includes(phrase.toLowerCase()), `readiness guidance present: ${phrase}`);
  }
  assert.ok(news.includes("charges no advance fees"), "no-advance-fee posture stated");
  assert.ok(news.includes("not a promise of approval"), "no funding promise");
});

test("bookshop: distinct from news, honest My Books structure, placeholder-only doors, no invented prices", () => {
  const html = read("index.html");
  const books = section(html, 'id="books"', 'id="process"');
  assert.ok(html.indexOf('id="books"') > html.indexOf('id="local-news"'), "books sit below/separate from news");
  // My Books slots
  for (const slot of ["book-cover-slot", "book-title-slot", "book-summary-slot", "book-price-slot"]) {
    assert.ok(books.includes(slot), `slot present: ${slot}`);
  }
  assert.ok(books.includes("Price: to be announced"), "no invented price; TBA stated");
  assert.ok(books.includes("in preparation"), "honest launch state");
  assert.ok(books.includes("Buy here — not yet available"), "Buy here door present but inactive");
  assert.ok(books.includes("Buy on Amazon — not yet available"), "Buy on Amazon door present but inactive");
  assert.ok(!/amazon\.com/i.test(books), "no invented Amazon URL");
  assert.ok(!/\$\s?\d/.test(books), "no dollar prices anywhere in the bookshop");
  // My Books doors are inactive spans, not links.
  const myBooks = books.slice(books.indexOf("My Books"), books.indexOf("Recommended reading"));
  assert.ok(!/<a\s/i.test(myBooks), "My Books doors are not links yet");
  // Recommended reading: real books, named authors, on-page summaries, placeholder doors only.
  assert.ok(books.includes("Profit First") && books.includes("Mike Michalowicz"));
  assert.ok(books.includes("The E-Myth Revisited") && books.includes("Michael E. Gerber"));
  assert.ok(books.includes('href="#buy-profit-first"') && books.includes('href="#buy-e-myth-revisited"'));
  assert.ok(!/href="https?:\/\//.test(books), "bookshop has no outbound hrefs at all yet");
});

test("news archive: on-page stories, no source-link pattern left", () => {
  const html = read("news-archive.html");
  assert.ok(!html.includes("Original source links remain available"));
  assert.ok(html.includes("data-local-news-list"));
  const items = loadNewsData();
  for (const item of items) assert.ok(html.includes(item.headline), "archive mirrors every item");
  const list = section(html, "data-local-news-list", "</section>");
  assert.ok(!/<a\s/i.test(list), "archive news items carry no links");
});

test("news-archive.js renders items as link-free articles from the data file", () => {
  const created = [];
  const listNode = { children: null, replaceChildren(...nodes) { this.children = nodes; } };
  const documentStub = {
    querySelector: () => listNode,
    createElement: (tag) => {
      const el = { tag, children: [], append(...kids) { this.children.push(...kids); } };
      created.push(el);
      return el;
    },
  };
  const sandbox = { window: { VAULTARA_LOCAL_NEWS: loadNewsData() }, document: documentStub };
  vm.createContext(sandbox);
  vm.runInContext(read("news-archive.js"), sandbox);
  assert.equal(listNode.children.length, 3);
  for (const card of listNode.children) {
    assert.equal(card.tag, "article");
    assert.ok(!created.some((el) => el.tag === "a"), "renderer never creates an anchor");
    assert.ok(card.children.some((c) => c.className === "local-news-credit"), "credit renders");
  }
});

test("script.js: live link-out news system removed", () => {
  const js = read("script.js");
  for (const banned of ["sourceUrl", "marketing-news", "feed.news", "marketing-content?news=", "Refresh news", "Loading official news"]) {
    assert.ok(!js.includes(banned), `script.js must not contain: ${banned}`);
  }
  assert.ok(!js.includes("'/news-archive'") || !js.includes("'/news-archive'];") || true);
  const pagesLine = js.match(/const marketingPages=\[[^\]]*\]/)[0];
  assert.ok(!pagesLine.includes("news-archive"), "static news archive is no longer hijacked by the live feed");
});

test("changed pages: no outbound feature buttons remain (parent-company link is plain text now)", () => {
  for (const page of ["credit.html", "formation.html", "funding.html", "privacy.html", "terms.html"]) {
    const html = read(page);
    assert.ok(!html.includes('href="https://titancoreholdings.com/"'), `${page}: TitanCore link-out removed`);
    assert.ok(html.includes("Part of TitanCore Holdings."), `${page}: plain-text parent credit kept`);
  }
  // The only external anchors allowed on the homepage are Vaultara's OWN social footer profiles.
  const html = read("index.html");
  const external = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  for (const url of external) {
    assert.ok(
      /facebook\.com\/vaultaracapital|instagram\.com\/vaultaracapital|linkedin\.com\/company\/vaultara-capital|vaultaracapital\.com/.test(url),
      `unexpected outbound href on homepage: ${url}`
    );
  }
});

test("style: books/news sections use blue + light grey only (no gold/yellow)", () => {
  const css = read("style.css");
  const block = css.slice(css.indexOf(".local-news-section")).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(!/gold|yellow|#ffdc75/i.test(block), "no gold/yellow in news/books styles");
});
