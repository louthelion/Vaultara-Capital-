/*
 * Vaultara Capital — Local news data file.
 *
 * This is the single source for the "Local news" feed on index.html and
 * news-archive.html. The static HTML in those pages mirrors the items below
 * (news-archive.js also renders this list on the archive page), so a refresh
 * updates this file AND the two mirrors in the same change.
 *
 * Refresh mechanics (owner rule, 2026-11-11): a morning-cadence editor/agent
 * pass replaces the dated items here — newest first, every item dated, every
 * summary written in our own words so the summary IS the read. There is NO
 * live scraping and NO feed fetch. Items carry NO URLs: sources are credited
 * as plain text only, and no news item may link a reader off this site.
 * An item with an "expiresAfter" date must be replaced by the first refresh
 * after that date.
 */
window.VAULTARA_LOCAL_NEWS = [
  {
    dateISO: "2026-11-11",
    dateLabel: "November 11, 2026",
    headline:
      "Bizcap opens a $175 million credit facility to lend more to small and midsize businesses",
    summary:
      "Bizcap, a direct lender and lending marketplace with a Miami base, has put a new $175 million credit facility in place to expand how much it can lend to small and midsize businesses. A facility like this is the lender's own funding supply: it does not approve any single business by itself, but it does mean more lending capacity is being aimed at companies of this size. For Florida owners, the practical lesson is preparation. A lender with fresh capacity still reviews purpose, records, and repayment, so organized financials and a clear use of funds are what turn general capacity into a real conversation.",
    source: "Bizcap announcement",
    sourceDateLabel: "November 11, 2026",
  },
  {
    dateISO: "2026-11-06",
    dateLabel: "November 6, 2026",
    headline:
      "Florida funding doors: SSBCI money is moving, and SBA 504 loans reach up to $5.5 million",
    summary:
      "FloridaCommerce's State Small Business Credit Initiative (SSBCI) program — a $142 million first tranche — is flowing to Florida businesses through participating lenders, including the Florida Business Development Corporation. The same corporation also offers SBA 504 loans of up to $5.5 million for owner-occupied real estate and equipment, plus a Rebuild Florida revolving loan door for businesses that need another route. None of these programs is automatic, and each carries its own eligibility rules. What an owner can do now is get ready: know the purpose, keep business records organized, and be able to show how the money would be used and repaid.",
    source: "Florida Business Development Corporation",
    sourceDateLabel: "November 6, 2026",
  },
  {
    dateISO: "2026-10-27",
    dateLabel: "October 27, 2026",
    headline:
      "Time-sensitive: the Federal Reserve's 2026 Small Business Credit Survey closes November 13",
    summary:
      "The Federal Reserve's 2026 Small Business Credit Survey is open through November 13, 2026, and small-business owners are invited to take part before it closes. The survey gathers owners' real experience — how their businesses are doing, whether they sought credit, and what happened when they did. Those answers shape the national picture that lenders and policymakers rely on when they judge small-business credit conditions. Taking part does not affect any application or credit decision; it simply makes sure Florida owners' experience is counted. This item expires after November 13, 2026, and will be replaced in the next refresh.",
    source:
      "Federal Reserve Small Business Credit Survey announcement via Emerald Coast lender partners",
    sourceDateLabel: "October 27, 2026",
    expiresAfter: "2026-11-13",
  },
];
