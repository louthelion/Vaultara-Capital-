/*
 * Vaultara Capital — Local news archive renderer (multi-page edition).
 *
 * Renders the items from news-data.js (window.VAULTARA_LOCAL_NEWS) into the
 * list on news-archive.html. Since the 2026-11-13 multi-page rebuild, each
 * story lives on its own article page (the item's "slug"), so the archive
 * renders LIST CARDS — picture, date, headline, one-line standfirst — that
 * link to the story's own page, where the full briefing is read. The static
 * HTML in news-archive.html mirrors the same list cards so the archive
 * reads correctly even before this script runs.
 */
(function () {
  var list = document.querySelector("[data-local-news-list]");
  if (!list || !Array.isArray(window.VAULTARA_LOCAL_NEWS)) return;

  var items = window.VAULTARA_LOCAL_NEWS.slice().sort(function (a, b) {
    return b.dateISO.localeCompare(a.dateISO);
  });

  var nodes = items.map(function (item) {
    var href = item.slug || "news.html";

    var card = document.createElement("article");
    card.className = "news-list-card";

    var thumb = document.createElement("a");
    thumb.className = "news-thumb";
    thumb.href = href;
    thumb.style.backgroundImage = "url('" + item.image.src + "')";
    thumb.setAttribute("role", "img");
    thumb.setAttribute("aria-label", item.headline);

    var body = document.createElement("div");
    body.className = "news-list-body";

    var time = document.createElement("time");
    time.className = "local-news-date";
    time.dateTime = item.dateISO;
    time.textContent = item.dateLabel;

    var headline = document.createElement("h3");
    var headlineLink = document.createElement("a");
    headlineLink.href = href;
    headlineLink.textContent = item.headline;
    headline.appendChild(headlineLink);

    var standfirst = document.createElement("p");
    standfirst.textContent = item.standfirst || "";

    var read = document.createElement("a");
    read.className = "home-article-read-link";
    read.href = href;
    read.textContent = "Read the full story →";

    body.append(time, headline, standfirst, read);
    card.append(thumb, body);
    return card;
  });

  list.replaceChildren.apply(list, nodes);
})();
