/*
 * Vaultara Capital — Local news archive renderer.
 *
 * Renders the items from news-data.js (window.VAULTARA_LOCAL_NEWS) into the
 * archive list on news-archive.html. Items are rendered as plain articles:
 * date, headline, full on-page summary, and a plain-text source credit.
 * News items NEVER carry a link — there is deliberately no anchor creation
 * in this file. The static HTML in news-archive.html mirrors the same items
 * so the archive reads correctly even before this script runs.
 */
(function () {
  var list = document.querySelector("[data-local-news-list]");
  if (!list || !Array.isArray(window.VAULTARA_LOCAL_NEWS)) return;

  var items = window.VAULTARA_LOCAL_NEWS.slice().sort(function (a, b) {
    return b.dateISO.localeCompare(a.dateISO);
  });

  var nodes = items.map(function (item) {
    var card = document.createElement("article");
    card.className = "local-news-card";

    var time = document.createElement("time");
    time.className = "local-news-date";
    time.dateTime = item.dateISO;
    time.textContent = item.dateLabel;

    var headline = document.createElement("h3");
    headline.textContent = item.headline;

    var summary = document.createElement("p");
    summary.textContent = item.summary;

    var credit = document.createElement("p");
    credit.className = "local-news-credit";
    credit.textContent =
      "Source: " + item.source + " — " + item.sourceDateLabel;

    card.append(time, headline, summary, credit);
    return card;
  });

  list.replaceChildren.apply(list, nodes);
})();
