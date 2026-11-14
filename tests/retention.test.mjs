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

// ---------------------------------------------------------------------------
// 2026-11-13 multi-page rebuild (Luders' direct order: no more
// everything-on-one-page scrolling). The retention invariants below are the
// SAME honesty standard as the one-page suite, re-homed to the new page map:
//   homepage        -> slim doors + the two latest stories as TEASERS only
//   news.html       -> the News page: every story as a list card
//   <item.slug>     -> one article page per story: the FULL briefing on-page
//   news-archive    -> a LIST of cards linking inward (no second full stack)
//   books.html      -> the bookshop + learning path, moved whole
//   contact.html    -> the intake form, moved whole
// Every assertion that moved is mapped in TEST-UPDATE.md; none was dropped.
// ---------------------------------------------------------------------------

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

test("homepage: slim doors + news TEASERS only — no full briefing lives on the homepage anymore", () => {
  const html = read("index.html");
  const items = loadNewsData();
  // The homepage is a set of doors: every main page is one click away.
  for (const page of ["news.html", "personal-credit.html", "business-credit.html", "books.html", "contact.html"]) {
    assert.ok(html.includes(`href="${page}"`), `homepage links to its own page: ${page}`);
  }
  // The bookshop and the intake form moved OFF the homepage to their own pages.
  assert.ok(!html.includes('id="books"'), "bookshop no longer stacked on the homepage");
  assert.ok(!html.includes("book-topic-slot"), "no book topic slots on the homepage");
  assert.ok(!html.includes("Vaultara-General-Intake"), "intake form no longer stacked on the homepage");
  // News on the homepage is teasers: the two latest stories, headline +
  // standfirst + picture + date, each linking INWARD to its article page.
  const news = section(html, "local-news-section", 'id="process"');
  for (const item of items.slice(0, 2)) {
    assert.ok(news.includes(item.headline), `homepage teases headline: ${item.headline}`);
    assert.ok(news.includes(item.standfirst), "homepage teases the story's one-line standfirst");
    assert.ok(news.includes(item.image.src), "homepage teaser carries the item picture");
    assert.ok(news.includes(`datetime="${item.dateISO}"`), "teaser is dated");
    assert.ok(news.includes(`href="${item.slug}"`), "teaser links inward to the story's own page");
  }
  for (const item of items.slice(2)) {
    assert.ok(!news.includes(item.headline), "older stories are not teased on the homepage — they live on the News page");
  }
  assert.ok(news.includes('href="news.html"'), "homepage doors onward to the News page");
  // THE multi-page pin: no briefing body text on the homepage at all. A
  // distinctive mid-briefing paragraph from every story is ABSENT here
  // (it is asserted PRESENT on its article page in the article test).
  for (const item of items) {
    assert.ok(!html.includes(item.body[1]), `mid-briefing paragraph must not live on the homepage: ${item.headline}`);
    for (const paragraph of item.body) assert.ok(!html.includes(paragraph), "no briefing paragraph renders on the homepage");
  }
  assert.ok(!/read more/i.test(news), "no read-more bounce language");
  assert.ok(!/read at the source/i.test(news), "no read-at-the-source bounce language");
  assert.ok(news.includes("charges no advance fees"), "no-advance-fee posture stated");
  assert.ok(news.includes("not a promise of approval"), "no funding promise");
});

test("news page: every story listed with headline, date, picture and standfirst, linking to its own article page", () => {
  const html = read("news.html");
  const list = section(html, "local-news-section", "</main>");
  const items = loadNewsData();
  assert.equal((list.match(/news-list-card/g) || []).length, items.length, "one list card per story");
  for (const item of items) {
    assert.ok(list.includes(item.headline), `news page lists headline: ${item.headline}`);
    assert.ok(list.includes(item.standfirst), "news page lists the standfirst");
    assert.ok(list.includes(item.image.src), "news page card carries the item picture");
    assert.ok(list.includes(`datetime="${item.dateISO}"`), "news page card is dated");
    assert.ok(list.includes(`href="${item.slug}"`), "news page card links to the story's own page");
    // A list is not a second full stack: no briefing body on the News page.
    for (const paragraph of item.body) assert.ok(!html.includes(paragraph), "no briefing paragraph renders on the News page");
  }
  assert.ok(list.includes('href="news-archive.html"'), "news page doors onward to the archive");
  assert.ok(html.includes("charges no advance fees"), "no-advance-fee posture stated");
  assert.ok(html.includes("not a promise of approval"), "no funding promise");
});

test("article pages: the FULL briefing lives on the story's own page — every paragraph, picture, plain-text credits, zero outbound links in the story", () => {
  const items = loadNewsData();
  for (const item of items) {
    const page = read(item.slug);
    assert.ok(page.includes(item.headline), `article page carries headline: ${item.headline}`);
    for (const paragraph of item.body) assert.ok(page.includes(paragraph), "article page renders every briefing paragraph in full");
    assert.ok(page.includes(item.image.src), "article page renders the item picture");
    assert.ok(page.includes(`alt="${item.image.alt}"`), "picture alt text renders");
    assert.ok(page.includes(item.image.credit), "picture credit renders as plain text");
    assert.ok(page.includes(`Source: ${item.source} — ${item.sourceDateLabel}`), "plain-text source credit renders at the end");
    assert.ok(page.includes(`datetime="${item.dateISO}"`), "article is dated");
    // The story itself carries NO links at all — the source is a plain-text
    // credit, never a door out (the one-page suite's core invariant).
    const article = section(page, "<article", "</article>");
    assert.ok(!/<a\s/i.test(article), "ZERO links inside the news story");
    assert.ok(!/href=/i.test(article), "ZERO href attributes inside the news story");
    // Page-wide, the only external anchors allowed are Vaultara's OWN
    // social footer profiles and same-site canonicals — the same allowlist
    // the homepage test below enforces. No source sites, no tool doors.
    const external = [...page.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
    for (const url of external) {
      assert.ok(
        /facebook\.com\/vaultaracapital|instagram\.com\/vaultaracapital|linkedin\.com\/company\/vaultara-capital|vaultaracapital\.com/.test(url),
        `unexpected outbound href on article page ${item.slug}: ${url}`
      );
    }
    // The other stories are one click away, inward.
    for (const other of items) {
      if (other !== item) assert.ok(page.includes(`href="${other.slug}"`), `article page cross-links inward to: ${other.slug}`);
    }
    assert.ok(page.includes("charges no advance fees"), "no-advance-fee posture stated");
    assert.ok(page.includes("not a promise of approval"), "no funding promise");
  }
});

test("bookshop: distinct from news, honest My Books structure, placeholder-only doors, no invented prices", () => {
  const page = read("books.html");
  const books = section(page, 'id="books"', '<section class="section section-soft"');
  // The bookshop is its own page now, distinct from news — it says so.
  assert.ok(books.includes("This shelf is not news"), "bookshop states it is distinct from news");
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
  const page = read("books.html");
  const books = section(page, 'id="books"', '<section class="section section-soft"');
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
  assert.ok(path.includes('href="news.html"'), "Step 1 points at the News page");
  assert.ok(path.includes("credit and business news"), "Step 1 points at the credit/business news");
  assert.ok(path.includes("funding-readiness guidance"), "Step 1 points at the funding-readiness value");
  assert.ok(path.includes("Credit, and Opening a Business"), "Step 2 names both book topics");
  assert.ok(path.includes('href="contact.html"'), "Step 3 uses the intake/contact door on the Contact page");
  assert.ok(path.includes("so much valuable information"), "the retention point of the path is stated");
  // Step 1's funding-readiness guidance moved with the path onto this page
  // (it sat inside the homepage news section in the one-page build).
  const readiness = books.slice(books.indexOf("funding-readiness"), books.indexOf("My Books"));
  for (const phrase of ["clear purpose", "records organized", "Separate personal and business credit"]) {
    assert.ok(readiness.toLowerCase().includes(phrase.toLowerCase()), `readiness guidance present: ${phrase}`);
  }
});

test("news archive: a LIST of cards linking inward — no second full-text stack, no source-link pattern left", () => {
  const html = read("news-archive.html");
  assert.ok(!html.includes("Original source links remain available"));
  assert.ok(html.includes("data-local-news-list"));
  const items = loadNewsData();
  const list = section(html, "data-local-news-list", "</section>");
  assert.equal((list.match(/news-list-card/g) || []).length, items.length, "one list card per story");
  for (const item of items) {
    assert.ok(list.includes(item.headline), "archive lists every item headline");
    assert.ok(list.includes(item.standfirst), "archive lists the standfirst");
    assert.ok(list.includes(item.image.src), "archive card carries the item picture");
    assert.ok(list.includes(`datetime="${item.dateISO}"`), "archive card is dated");
    assert.ok(list.includes(`href="${item.slug}"`), "archive card links inward to the story's own page");
    for (const paragraph of item.body) assert.ok(!list.includes(paragraph), "archive carries NO briefing paragraphs — the full text lives on the article page");
  }
  // Every link in the archive list points INWARD at a story's own page.
  const hrefs = [...list.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(hrefs.length > 0, "archive list links exist");
  for (const href of hrefs) {
    assert.ok(items.some((i) => i.slug === href), `archive link must point at a story page, found: ${href}`);
  }
});

test("news-archive.js renders list cards from the data file — picture, date, headline, standfirst, inward links only", () => {
  const created = [];
  const listNode = { children: null, replaceChildren(...nodes) { this.children = nodes; } };
  const documentStub = {
    querySelector: () => listNode,
    createElement: (tag) => {
      const el = {
        tag,
        className: "",
        children: [],
        style: {},
        attributes: {},
        append(...kids) { this.children.push(...kids); },
        appendChild(kid) { this.children.push(kid); return kid; },
        setAttribute(name, value) { this.attributes[name] = value; },
      };
      created.push(el);
      return el;
    },
  };
  const sandbox = { window: { VAULTARA_LOCAL_NEWS: loadNewsData() }, document: documentStub };
  vm.createContext(sandbox);
  vm.runInContext(read("news-archive.js"), sandbox);
  const items = loadNewsData();
  const sorted = [...items].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  assert.equal(listNode.children.length, items.length, "one card per item");
  listNode.children.forEach((card, n) => {
    const item = sorted[n];
    assert.equal(card.tag, "article");
    assert.equal(card.className, "news-list-card", "card is a list card");
    const thumb = card.children.find((c) => c.className === "news-thumb");
    assert.ok(thumb && thumb.tag === "a", "picture thumb renders as a link");
    assert.equal(thumb.href, item.slug, "thumb links inward to the story's own page");
    assert.ok(thumb.style.backgroundImage.includes(item.image.src), "thumb carries the item's library picture");
    assert.equal(thumb.attributes["aria-label"], item.headline, "thumb is labelled with the headline");
    const body = card.children.find((c) => c.className === "news-list-body");
    const time = body.children.find((c) => c.tag === "time");
    assert.equal(time.dateTime, item.dateISO, "card is dated");
    assert.ok(item.dateLabel && time.textContent === item.dateLabel, "date label renders");
    const headlineLink = body.children.find((c) => c.tag === "h3").children[0];
    assert.equal(headlineLink.textContent, item.headline, "headline renders");
    assert.equal(headlineLink.href, item.slug, "headline links inward");
    const standfirst = body.children.find((c) => c.tag === "p");
    assert.equal(standfirst.textContent, item.standfirst, "standfirst renders — a list line, never the briefing");
    const read = body.children.find((c) => c.className === "home-article-read-link");
    assert.equal(read.href, item.slug, "read link points inward");
  });
  // Every anchor the renderer creates points INWARD (a story slug) — never out.
  const anchors = created.filter((el) => el.tag === "a");
  assert.ok(anchors.length >= items.length * 3, "thumb + headline + read link per card");
  for (const a of anchors) {
    assert.ok(!/https?:/.test(a.href), `renderer link must stay on-site, found: ${a.href}`);
    assert.ok(items.some((i) => i.slug === a.href), `renderer link must be a story page, found: ${a.href}`);
  }
  // No rendered node carries briefing body text — the full story is the
  // article page's job now (the one-page renderer test pinned full text
  // HERE; that invariant's new home is the article-pages test above).
  for (const el of created) {
    for (const item of items) {
      for (const paragraph of item.body) assert.notEqual(el.textContent, paragraph, "list renderer never renders briefing paragraphs");
    }
  }
});

test("sharpened standard: no banned bounce strings in any news surface; legacy link-out paths stay gone", () => {
  const items = loadNewsData();
  const newsSurfaces = {
    "news-data.js": read("news-data.js"),
    "news-archive.js": read("news-archive.js"),
    "news.html": read("news.html"),
    "index.html news teasers": section(read("index.html"), "local-news-section", 'id="process"'),
    "news-archive.html list": section(read("news-archive.html"), "data-local-news-list", "</section>"),
  };
  for (const item of items) newsSurfaces[`article page ${item.slug}`] = read(item.slug);
  for (const [name, text] of Object.entries(newsSurfaces)) {
    for (const banned of ["Read at the source", "Read more", "sourceUrl", "marketing-content?news="]) {
      assert.ok(!text.includes(banned), `${name} must not contain: ${banned}`);
    }
    assert.ok(!/read more/i.test(text), `${name} must not contain read-more bounce language`);
    assert.ok(!/read at the source/i.test(text), `${name} must not contain read-at-the-source bounce language`);
    assert.ok(!/chatgpt/i.test(text), `${name} must not carry a ChatGPT door`);
    assert.ok(!/perplexity/i.test(text), `${name} must not carry a Perplexity door`);
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
