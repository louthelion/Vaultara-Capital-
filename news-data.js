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
 * Each item also carries a "lane" — "Florida & Local" or
 * "National & World" — which the news index groups by and each
 * story page shows above its date line.
 *
 * Refresh mechanics (owner rule, 2026-11-11): a morning-cadence editor/agent
 * pass replaces the dated items here — newest first, every item dated.
 * There is NO live scraping and NO feed fetch. An item with an
 * "expiresAfter" date must be replaced by the first refresh after that
 * date; its facts remain true as a dated record until then.
 */
window.VAULTARA_LOCAL_NEWS = [

  {
    dateISO: "2026-11-20",
    slug: "news-florida-emergency-bridge-loans.html",
    lane: "Florida & Local",
    standfirst: "FloridaCommerce has $10 million in short-term, zero-interest bridge loans open for small businesses hurt by Hurricane Isaias in 30 Florida counties \u2014 applications close November 25, 2026, or when the money runs out.",
    dateLabel: "November 20, 2026",
    headline: "Time-sensitive: Florida\u2019s zero-interest emergency bridge loans for storm-hit businesses close November 25",
    body: [
      "FloridaCommerce has activated the Florida Small Business Emergency Bridge Loan Program, making $10 million available to small businesses impacted by Hurricane Isaias. The loans are open to businesses in 30 designated counties, including Escambia, Santa Rosa, Hillsborough, Pinellas and Pasco. A bridge loan is exactly what its name says: short-term money that carries a business across the gap between a disaster and the longer-term recovery funding \u2014 an insurance payout, a federal disaster loan, or a commercial loan \u2014 that takes longer to arrive.",
      "The terms are as plain as state lending gets. Eligible small businesses, including sole proprietors, can apply for up to $100,000, and agriculture and aquaculture businesses can apply for up to $150,000. The loans are zero-interest and short-term, and they are loans, not grants: every dollar must be repaid. FloridaCommerce runs the program with Florida First Capital Finance Corporation as its fiscal administrator. The deadline is the sharp edge of this story: applications are open through November 25, 2026, or until all funds are exhausted, whichever comes first.",
      "For a Florida owner whose business took storm damage, the useful lesson is that bridge money rewards the prepared. The businesses that move first are the ones that can already show what the storm cost them \u2014 damage records, revenue interruption, and organized financials \u2014 rather than starting that paperwork while the window is closing. If your business was hurt by Hurricane Isaias and sits in one of the designated counties, the calendar matters more than the brochure: five days remain from the date of this briefing. Applications run through FloridaCommerce\u2019s Disaster Recovery program pages at FloridaJobs.org. This news is information only: Vaultara Capital charges no advance fees, and a review is not a promise of financing or approval."
    ],
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      alt: "The storefront of a small retail business on a main street",
      credit: "Photo via Unsplash \u2014 free-license library photo",
    },
    source: "FloridaCommerce",
    sourceDateLabel: "October 2026",
  },
  {
    dateISO: "2026-11-20",
    slug: "news-sba-100-billion-fy26.html",
    lane: "National & World",
    standfirst: "The SBA guaranteed 62,205 7(a) and 504 loans worth $39.5 billion in fiscal 2026 \u2014 the third-highest volume in agency history \u2014 despite a 43-day shutdown that froze lending for nearly two months.",
    dateLabel: "November 20, 2026",
    headline: "SBA closes fiscal 2026 with $100 billion delivered and its third-highest loan volume ever",
    body: [
      "On November 2, 2026, the U.S. Small Business Administration announced that it closed fiscal year 2026 \u2014 the year that ended September 30 \u2014 with $100 billion in capital and related assistance delivered through its flagship programs. The core of that total is guaranteed lending: the SBA backed 62,205 loans under its 7(a) and 504 programs, totaling $39.5 billion. The agency calls that the third-highest lending volume in its history, building on a record-setting fiscal 2025.",
      "The split shows where the money went. The 7(a) program, the SBA\u2019s general-purpose loan guarantee used for working capital, equipment and acquisitions, approved 56,130 loans totaling $32.4 billion. The 504 program, aimed at owner-occupied real estate and heavy equipment, approved 6,075 loans totaling $7.1 billion \u2014 together, about 1,350 small-business loans a week. Beyond the two loan programs, the Small Business Investment Company (SBIC) program closed the year with a record $60 billion in combined private capital and SBA leverage, the SBA supported more than 9,700 startups with $6.5 billion in financing, and it disbursed $192 million in disaster loans.",
      "The number deserves one piece of context before any owner reads it as a forecast. The year included a 43-day federal shutdown that halted SBA lending; the agency estimates it could not guarantee roughly $170 million in loans each business day of that freeze, about $5 billion in financing that otherwise could have been approved. For a Florida business owner, the practical reading is narrower and more useful: the country\u2019s main small-business lending door is open, busy, and processing at near-record pace \u2014 which means the applications that move are the prepared ones, with a clear purpose for the money, organized records, and a repayment story a lender can follow. This news is information only: Vaultara Capital charges no advance fees, and a review is not a promise of financing or approval."
    ],
    image: {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      alt: "A glass office building facade seen from below against the sky",
      credit: "Photo via Unsplash \u2014 free-license library photo",
    },
    source: "U.S. Small Business Administration",
    sourceDateLabel: "November 2, 2026",
  },
  {
    dateISO: "2026-11-20",
    slug: "news-sba-tighter-credit-box-fy27.html",
    lane: "National & World",
    standfirst: "A second round of SBA underwriting rules took effect October 1, 2026: CPA earnings reports for bigger acquisitions, stricter debt-service tests, a cap on non-cash equity, and approvals judged on trailing earnings, not projections.",
    dateLabel: "November 20, 2026",
    headline: "SBA loans enter fiscal 2027 under a tighter credit box: four rules that got stricter on October 1",
    body: [
      "The U.S. Small Business Administration opened fiscal year 2027 on October 1, 2026 with a second round of tighter underwriting rules for its 7(a) and 504 loan programs, as American Banker reported on October 9, 2026. A \u201ccredit box\u201d is the set of standards lenders use to decide which applications qualify \u2014 the box this story describes is the one every SBA application now has to fit inside. The new rules land on top of an earlier revision from June 2025, which reinstated a 10% equity injection for startup and change-of-ownership financing and tightened personal-guarantee and small-dollar loan rules.",
      "Four things got harder for borrowers. First, anyone seeking more than $3 million for a business acquisition must obtain a CPA-prepared quality-of-earnings report \u2014 an independent review of whether the target company\u2019s reported profits are real and repeatable. Second, lenders must apply stricter debt-service requirements, meaning the business\u2019s cash flow must cover its loan payments by a wider margin. Third, non-cash sources such as a seller note can cover no more than half of the required 10% equity injection: on a $1 million purchase, the injection is $100,000, and at most $50,000 of it can be non-cash. Fourth, underwriting decisions must rest on trailing earnings \u2014 the business\u2019s actual historical results \u2014 rather than on forward-looking projections.",
      "The agency\u2019s stated aim is restoring prudent lending standards after a looser period, and the effect is already visible in the numbers: American Banker reported that fiscal 2026 lending fell across both flagship programs, with 7(a) dollar volume down by a double-digit percentage. For a Florida owner, the preparation lesson is concrete. Clean up the trailing financials before applying, because history is now the application. Document where the cash part of your equity injection comes from. Run the debt-service math on past earnings, not on the growth you plan \u2014 if the deal only works on projections, it does not work under these rules. This news is information only: Vaultara Capital charges no advance fees, and a review is not a promise of financing or approval."
    ],
    image: {
      src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
      alt: "A pen resting on a signed business agreement on a desk",
      credit: "Photo via Unsplash \u2014 free-license library photo",
    },
    source: "American Banker, reported by Novo",
    sourceDateLabel: "October 9, 2026",
  },

  {
    dateISO: "2026-11-11",
    slug: "news-bizcap-credit-facility.html",
    lane: "National & World",
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
    lane: "Florida & Local",
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
];
