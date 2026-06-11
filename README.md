# Vaultara Capital

Independent public website for **Vaultara Capital**, serving credit readiness, funding guidance, and business formation clients.

## Production domains

- Vaultara Capital: <https://vaultaracapital.com>
- Parent company, TitanCore Holdings: <https://titancoreholdings.com>

Vaultara identifies TitanCore Holdings as its parent network and links visitors to TitanCore's company directory. The TitanCore Holdings company directory must complete the connection in the other direction: its **Open Vaultara Page** link must use the absolute URL `https://vaultaracapital.com/`, not the internal `/vaultara` route.

```html
<a href="https://vaultaracapital.com/">Open Vaultara Website</a>
```

## Deployment

This repository is deployable as a static site. `CNAME` declares the custom domain for GitHub Pages, while `netlify.toml` and `_redirects` support Netlify deployments. Legacy `/Vaultara.html`, `/vaultara.html`, and `/vaultara` entry points all lead to `https://vaultaracapital.com/`, ensuring old TitanCore links and bookmarks open the independent website.
