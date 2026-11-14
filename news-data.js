/*
 * Vaultara Capital — Local news data file.
 *
 * This is the single source for the "Local news" stories. Since the
 * 2026-11-13 multi-page rebuild, each story lives on its OWN article page
 * (the "slug" field); news.html and news-archive.html carry list cards
 * (headline, picture, date, standfirst) that link to the article pages,
 * whose static HTML mirrors the full briefing below. news-archive.js also
 * renders the list on the archive page. A refresh updates this file AND
 * the mirrors (list cards + article page) in the same change.
 *
 * SHARPENED STANDARD (2026-11-11): news is ALL the information, read fully
 * on the page. Every item is a FULL briefing — headline, date, a real
 * picture, and a multi-paragraph body (the "body" array) written in our own
 * words — never a stub and never a teaser. Sources are referred to BY NAME
 * ONLY as a plain-text credit; no item carries a link of any kind.
 * Pictures are free-license library photos served from the Unsplash CDN —
 * the image src is the ONLY URL an item may carry, and it is never a
 * source-article image.
 *
 * Refresh mechanics (owner rule, 2026-11-11): a morning-cadence editor/agent
 * pass replaces the dated items here — newest first, every item dated.
 * There is NO live scraping and NO feed fetch. An item with an
 * "expiresAfter" date must be replaced by the first refresh after that
 * date; its facts remain true as a dated record until then.
 */
window.VAULTARA_LOCAL_NEWS = [

  {
    dateISO: "2026-11-11",
    slug: "news-bizcap-credit-facility.html",
    standfirst: "A Miami lending marketplace lined up $175 million of new capacity for small and midsize business loans — and the preparation lesson it holds for Florida owners.",
    dateLabel: "November 11, 2026",
    headline: "Bizcap opens a $175 million credit facility to lend more to small and midsize businesses",
    body: [
      "On November 11, 2026, Bizcap, a direct lender and lending marketplace based in Miami, announced that it had closed a $175 million credit facility. The facility is there to expand the fast, flexible funding Bizcap offers small and mid-sized businesses across the United States and Canada. According to the company, it has already provided more than $5 billion in funding to over 100,000 businesses, and this new facility is meant to grow that reach.",
      "A credit facility, in plain words, is funding a lender lines up for itself so it can keep lending to others. The $175 million is not a loan to any one business, and it does not approve any single application. It is capacity sitting behind many future loans, which matters because a lender can only say yes as long as it has money ready to lend. When a lender adds capacity of this size, it is a sign that money is still being aimed at businesses of this size rather than only at large companies.",
      "For a Florida business owner, the useful lesson is about preparation, not about this one lender. Fresh capacity still gets reviewed the same way as any funding: the lender looks at what the money is for, whether the business records are organized, and how the loan would be repaid. An owner who can explain a clear purpose, show tidy financial records, and point to realistic repayment is the owner best placed when new capacity opens up. This news is information only: Vaultara Capital charges no advance fees, and a review is not a promise of financing or approval.",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
      alt: "Two business people shaking hands after reaching an agreement",
      credit: "Photo via Unsplash — free-license library photo",
    },
    source: "Bizcap announcement",
    sourceDateLabel: "November 11, 2026",
  },
  {
    dateISO: "2026-11-06",
    slug: "news-florida-funding-doors.html",
    standfirst: "State-backed SSBCI money is moving through Florida lenders, SBA 504 loans reach up to $5.5 million, and the Rebuild Florida Business Loan Fund revolves to the next business in line.",
    dateLabel: "November 6, 2026",
    headline: "Florida funding doors: SSBCI money is moving, and SBA 504 loans reach up to $5.5 million",
    body: [
      "On November 6, 2026, the Florida Business Development Corporation set out how several state-backed and federal funding doors are working for Florida small businesses right now. Florida routes federal State Small Business Credit Initiative money, known as SSBCI, through participating Florida lenders, with FloridaCommerce administering the program and a $142 million first tranche ready. The same corporation also works with SBA 504 loans and the Rebuild Florida Business Loan Fund.",
      "The numbers are worth reading slowly. The $142 million is a first tranche, meaning a first portion of program money moving through lenders rather than a grant paid directly to owners. SBA 504 loans can reach up to $5.5 million, and they are aimed at big, lasting purchases such as owner-occupied buildings and equipment. The Rebuild Florida Business Loan Fund began with $40 million, that money is now fully deployed, and the fund revolves: as earlier loans are repaid, the money is lent again to the next business in line.",
      "For a Florida owner, the practical point is that none of these programs is automatic, and each one carries its own eligibility rules. The doors are real, but they open through a lender review, so the work an owner can do today is the readiness work: know exactly what the money would be used for, keep business records organized and current, and be ready to show how the funding would be repaid. Starting that preparation before a conversation with a lender puts a business in a stronger position than starting it after. Vaultara Capital charges no advance fees, and no program mentioned here is a promise of approval.",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      alt: "Business people reviewing paperwork and plans together at a table with laptops",
      credit: "Photo via Unsplash — free-license library photo",
    },
    source: "Florida Business Development Corporation",
    sourceDateLabel: "November 6, 2026",
  },
  {
    dateISO: "2026-10-27",
    slug: "news-federal-reserve-credit-survey.html",
    standfirst: "Florida owners were invited to share their real experience of business credit in the Federal Reserve's 2026 Small Business Credit Survey, open through November 13, 2026.",
    dateLabel: "October 27, 2026",
    headline: "Time-sensitive: the Federal Reserve's 2026 Small Business Credit Survey closes November 13",
    body: [
      "On October 27, 2026, word went out with Florida partners, in an announcement carried by the ELC of the Emerald Coast, that the Federal Reserve's 2026 Small Business Credit Survey was open and inviting Florida owners to take part. The survey is run by all 12 Federal Reserve Banks, and it asks owners about their real experience of business financing: how the business is doing, whether it looked for credit, and what happened when it did.",
      "The details are simple. The survey is for for-profit businesses with fewer than 500 employees, it takes about 12 minutes to complete, and answers are confidential. It stays open through November 13, 2026, and then it closes. There is no cost to take part, and taking part does not affect any loan application or credit decision an owner has made or will make. What the answers do is build the national picture of small-business credit that lenders and policymakers rely on when they judge how well credit is working.",
      "For a Florida business owner, this is a short way to be counted. If getting credit has been easy, that experience matters; if it has been hard, that experience matters just as much, because decision-makers cannot fix a gap they cannot see. Owners who want their experience included need to complete the survey before it closes on November 13, 2026. A dated note for readers after that day: this item describes the survey as it stood when announced, it expires after November 13, 2026, and the next morning refresh replaces it with current news.",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80",
      alt: "Hands typing on a laptop keyboard while completing an online form",
      credit: "Photo via Unsplash — free-license library photo",
    },
    source: "Federal Reserve Small Business Credit Survey announcement via Emerald Coast lender partners",
    sourceDateLabel: "October 27, 2026",
    expiresAfter: "2026-11-13",
  },
];
