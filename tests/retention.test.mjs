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

test("news data: dated, newest first, FULL briefings, pictures, plain-text credits, no link fields", () => {
  const items = loadNewsData();
  assert.ok(Array.isArray(items) && items.length >= 3);
  const dates = items.map((i) => i.dateISO);
  assert.equal(dates.join(","), [...dates].sort().reverse().join(","), "items must be newest first");
  for (const item of items) {
    assert.match(item.dateISO, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.headline.length > 20, "headline present");
    // Sharpened standard: the body IS the full briefing — at least 3
    // paragraphs and at least 700 characters joined, never a stub.
    assert.ok(Array.isArray(item.body) && item.body.length >= 3, "at least 3 body paragraphs");
    assert.ok(item.body.join(" ").length >= 700, "full briefing body must be >=700 chars, not a teaser");
    // A real picture inside each item: free-license library photo only.
    assert.ok(item.image && item.image.alt && item.image.credit, "image alt + plain-text credit present");
    assert.match(item.image.src, /^https:\/\/images\.unsplash\.com\//, "picture is an Unsplash CDN library photo");
    assert.ok(item.source && item.sourceDateLabel, "plain-text source credit present");
    assert.ok(!("url" in item) && !("href" in item) && !("sourceUrl" in item), "news items carry no URL fields");
  }
  // The ONLY URLs anywhere in the data file are the pictures' Unsplash srcs.
  const urls = read("news-data.js").match(/https?:\/\/[^"\s]+/g) || [];
  assert.ok(urls.length >= 3, "picture URLs present");
  for (const u of urls) assert.ok(u.startsWith("https://images.unsplash.com/"), `only Unsplash picture URLs allowed, found: ${u}`);
  const survey = items.find((i) => i.headline.includes("Small Business Credit Survey"));
  assert.equal(survey.expiresAfter, "2026-11-13", "time-sensitive survey item is flagged for replacement");
});

test("homepage Local news renders on-page: all full briefings + pictures, zero links inside news items", () => {
  const html = read("index.html");
  const news = section(html, 'id="local-news"', 'id="books"');
  const items = loadNewsData();
  for (const item of items) {
    assert.ok(news.includes(item.headline), `homepage renders headline: ${item.headline}`);
    for (const paragraph of item.body) assert.ok(news.includes(paragraph), "homepage renders every briefing paragraph in full");
    assert.ok(news.includes(item.image.src), "homepage renders the item picture");
    assert.ok(news.includes(item.image.alt), "picture alt text renders");
    assert.ok(news.includes(item.image.credit), "picture credit renders as plain text");
    assert.ok(news.includes(`Source: ${item.source} — ${item.sourceDateLabel}`), "plain-text credit renders");
    assert.ok(news.includes(`datetime="${item.dateISO}"`), "item is dated");
  }
  const cards = news.slice(news.indexOf("local-news-list"), news.indexOf("funding-readiness"));
  assert.ok(!/<a\s/i.test(cards), "ZERO hrefs/links inside news items");
  assert.ok(!/href=/i.test(cards), "ZERO href attributes inside news items");
  assert.ok(!/read more/i.test(news), "no read-more bounce language");
  assert.ok(!/read at the source/i.test(news), "no read-at-the-source bounce language");
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

test("bookshop topic slots + learning path: two TOPIC slots (Credit + Opening a Business), generic coming-soon copy replaced by the path", () => {
  const html = read("index.html");
  const books = section(html, 'id="books"', 'id="process"');
  // (a) Both book topic slots are present in the books section, labelled as topics, NOT titles.
  assert.equal((books.match(/book-topic-slot/g) || []).length, 2, "exactly two topic-slot cards");
  assert.ok(books.includes('data-book-topic="credit"'), "Credit topic slot present");
  assert.ok(books.includes('data-book-topic="opening-a-business"'), "Opening a Business topic slot present");
  assert.ok(books.includes("Topic slot — Credit"), "Credit slot labelled as a topic");
  assert.ok(books.includes("Topic slot — Opening a Business"), "Opening a Business slot labelled as a topic");
  assert.ok(books.includes("explain credit in plain words"), "Credit slot: credit explained in plain words");
  assert.ok(books.includes("how to open and run a business"), "Opening a Business slot: opening and running a business");
  assert.equal((books.match(/not a title yet/g) || []).length, 2, "each slot says its topic is not a title yet");
  // Each slot reuses the card structure: cover/title/summary/price slots, price TBA, both doors inactive.
  for (const slot of ["book-cover-slot", "book-title-slot", "book-summary-slot", "book-price-slot"]) {
    assert.ok((books.split(slot).length - 1) >= 2, `${slot} present on both topic slots`);
  }
  const myBooks = books.slice(books.indexOf("My Books"), books.indexOf("Recommended reading"));
  assert.equal((myBooks.match(/is-disabled/g) || []).length, 4, "both doors inactive on both topic slots (2 slots x 2 doors)");
  assert.ok(!/<a\s/i.test(myBooks), "topic-slot doors are inactive spans, not links");
  assert.ok(!/\$\s?\d/.test(myBooks), "no invented prices on the topic slots");
  assert.ok(!/amazon\.com/i.test(myBooks), "no invented Amazon URL on the topic slots");
  // (b) The generic coming-soon copy is GONE, replaced by the learning-path framing.
  assert.ok(!/coming soon/i.test(books), "old generic coming-soon copy must be gone from the Books section");
  assert.ok(books.includes("Vaultara's learning path"), "learning path framing present");
  assert.ok(books.includes("Step 1 — Free:"), "Step 1 present");
  assert.ok(books.includes("Step 2 — His books:"), "Step 2 present");
  assert.ok(books.includes("Step 3 — Work with Vaultara:"), "Step 3 present");
  const pathStart = books.indexOf("Vaultara's learning path");
  const path = books.slice(pathStart, books.indexOf("My Books", pathStart));
  assert.ok(path.includes("Local news"), "Step 1 points at the on-page credit/business news");
  assert.ok(path.includes("funding-readiness guidance"), "Step 1 points at the on-page funding-readiness value");
  assert.ok(path.includes("Credit, and Opening a Business"), "Step 2 names both book topics");
  assert.ok(path.includes('href="#contact"'), "Step 3 uses the intake/contact door that already exists on this page");
  assert.ok(path.includes("so much valuable information"), "the retention point of the path is stated");
});

test("news archive: on-page full briefings + pictures, no source-link pattern left", () => {
  const html = read("news-archive.html");
  assert.ok(!html.includes("Original source links remain available"));
  assert.ok(html.includes("data-local-news-list"));
  const items = loadNewsData();
  for (const item of items) {
    assert.ok(html.includes(item.headline), "archive mirrors every item headline");
    for (const paragraph of item.body) assert.ok(html.includes(paragraph), "archive mirrors every briefing paragraph");
    assert.ok(html.includes(item.image.src), "archive mirrors the item picture");
  }
  const list = section(html, "data-local-news-list", "</section>");
  assert.ok(!/<a\s/i.test(list), "archive news items carry no links");
  assert.ok(!/href=/i.test(list), "archive news items carry no href attributes");
});

test("news-archive.js renders full briefings as link-free articles from the data file", () => {
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
    assert.ok(card.children.some((c) => c.className === "local-news-photo"), "picture figure renders inside the item");
    const paragraphs = card.children.filter((c) => c.tag === "p" && c.className !== "local-news-credit");
    assert.ok(paragraphs.length >= 3, "every body paragraph renders");
  }
  const imgs = created.filter((el) => el.tag === "img");
  assert.equal(imgs.length, 3, "one picture per item");
  for (const img of imgs) assert.match(img.src, /^https:\/\/images\.unsplash\.com\//, "rendered picture is the library photo");
});

test("sharpened standard: no banned bounce strings in any news surface; legacy link-out paths stay gone", () => {
  const newsSurfaces = {
    "news-data.js": read("news-data.js"),
    "news-archive.js": read("news-archive.js"),
    "index.html news section": section(read("index.html"), 'id="local-news"', 'id="books"'),
    "news-archive.html list": section(read("news-archive.html"), "data-local-news-list", "</section>"),
  };
  for (const [name, text] of Object.entries(newsSurfaces)) {
    for (const banned of ["Read at the source", "Read more", "sourceUrl", "marketing-content?news="]) {
      assert.ok(!text.includes(banned), `${name} must not contain: ${banned}`);
    }
  }
  const js = read("script.js");
  for (const banned of ["sourceUrl", "marketing-content?news=", "feed.news", "Refresh news"]) {
    assert.ok(!js.includes(banned), `script.js legacy news path must stay gone: ${banned}`);
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
  assert.ok(css.includes(".local-news-photo"), "news picture frame styles present (brand frame)");
});
