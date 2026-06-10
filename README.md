# Vaultara Capital

Independent public website for **Vaultara Capital**, serving credit readiness, funding guidance, and business formation clients.

## Production domains

- Vaultara Capital: <https://vaultaracapital.com>
- Parent company, TitanCore Holdings: <https://titancoreholdings.com>

The Vaultara Capital card or company-page link on TitanCore Holdings must use the absolute URL `https://vaultaracapital.com` so visitors leave the parent-company site and open this independent website. The root `index.html` is Vaultara Capital’s homepage; its services, forms, articles, and footer remain Vaultara-branded.

## Deployment

This repository is deployable as a static site. `CNAME` declares the custom domain for GitHub Pages, while `netlify.toml` and `_redirects` support Netlify deployments and preserve the former `/Vaultara.html` URL.
