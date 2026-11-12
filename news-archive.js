/*
 * Vaultara Capital — Local news archive renderer.
 *
 * Renders the items from news-data.js (window.VAULTARA_LOCAL_NEWS) into the
 * archive list on news-archive.html. Items are rendered as plain articles:
 * date, headline, the item's picture, every body paragraph of the full
 * briefing, and a plain-text source credit (the source is named, never
 * linked). News items NEVER carry a link — there is deliberately no anchor
 * creation in this file. The static HTML in news-archive.html mirrors the
 * same items so the archive reads correctly even before this script runs.
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

    var figure = document.createElement("figure");
    figure.className = "local-news-photo";
    var img = document.createElement("img");
    img.src = item.image.src;
    img.alt = item.image.alt;
    img.loading = "lazy";
    var caption = document.createElement("figcaption");
    caption.textContent = item.image.credit;
    figure.append(img, caption);

    var credit = document.createElement("p");
    credit.className = "local-news-credit";
    credit.textContent =
      "Source: " + item.source + " — " + item.sourceDateLabel;

    var children = [time, headline, figure];
    (item.body || []).forEach(function (text) {
      var paragraph = document.createElement("p");
      paragraph.textContent = text;
      children.push(paragraph);
    });
    children.push(credit);
    card.append.apply(card, children);
    return card;
  });

  list.replaceChildren.apply(list, nodes);
})();
