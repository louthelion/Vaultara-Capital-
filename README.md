# Vaultara Capital

Independent public website for **Vaultara Capital**, serving credit readiness, funding guidance, and business formation clients.

## Production domains

- Vaultara Capital: <https://vaultaracapital.com>
- Parent company, TitanCore Holdings: <https://titancoreholdings.com>

This repository is the standalone Vaultara website and must retain its funding, credit education, formation, intake, legal, and confirmation pages. Those pages must not be copied into the TitanCore Holdings website.

Vaultara identifies TitanCore Holdings as its parent company with a small link to `https://titancoreholdings.com/`. TitanCore must complete the connection in the other direction with a subsidiary card whose **Open Vaultara Capital** link uses the absolute URL `https://vaultaracapital.com/`, not an internal `/vaultara` route.

```html
<a href="https://vaultaracapital.com/" target="_blank" rel="noopener">Open Vaultara Page</a>
```

Do not use `href="/vaultara"`, `href="vaultara.html"`, or another relative path on the TitanCore site. Relative links remain on `titancoreholdings.com` and produce the Netlify 404 shown when that deployment does not contain the requested route.

## Deployment

This repository is deployable as a static site. `CNAME` declares the custom domain for GitHub Pages, while `netlify.toml` and `_redirects` support Netlify deployments. Legacy Vaultara/Voltara entry points—including capitalization, `-capital`, `.html`, trailing-slash, and nested-path variants—lead to `https://vaultaracapital.com/`, ensuring old links and bookmarks open the independent website. The custom `404.html` applies the same compatibility behavior on static hosts that do not process Netlify redirect rules.
