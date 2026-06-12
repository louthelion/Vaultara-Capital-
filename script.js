const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function closeMenu() {
  if (!menuButton || !mobileNav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
  document.body.classList.remove('nav-open');
}

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !willOpen;
    document.body.classList.toggle('nav-open', willOpen);
  });

  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
}

function encodeForm(form) {
  return new URLSearchParams(new FormData(form)).toString();
}

document.querySelectorAll('[data-intake-root]').forEach((root) => {
  const selector = root.querySelector('[data-intake-selector]');
  const blocks = root.querySelectorAll('[data-intake-block]');
  const success = root.querySelector('[data-intake-success]');

  if (selector) {
    selector.addEventListener('change', () => {
      blocks.forEach((block) => block.classList.toggle('hidden', block.id !== selector.value));
      const activeBlock = root.querySelector(`#${CSS.escape(selector.value)}`);
      activeBlock?.querySelector('input:not([type="hidden"])')?.focus();
    });
  }

  root.querySelectorAll('.js-intake-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector('.form-status');
      const originalLabel = button.innerHTML;
      button.disabled = true;
      button.textContent = 'Submitting…';
      status.textContent = '';

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encodeForm(form)
        });
        if (!response.ok) throw new Error(`Submission failed with ${response.status}`);
        root.querySelectorAll('[data-intake-hide]').forEach((element) => element.classList.add('hidden'));
        success?.classList.remove('hidden');
        success?.focus();
      } catch (error) {
        status.textContent = 'We could not submit your intake. Please try again or contact us directly.';
        button.disabled = false;
        button.innerHTML = originalLabel;
      }
    });
  });
});

function polishVaultaraBranding() {
  document.querySelectorAll('.wordmark-mark').forEach((mark) => {
    mark.textContent = 'VC';
    mark.style.fontSize = mark.closest('.wordmark-footer') ? '22px' : '21px';
    mark.style.letterSpacing = '-1px';
  });

  document.querySelectorAll('.wordmark').forEach((wordmark) => {
    const textWrap = wordmark.querySelector('span:last-child');
    const strong = textWrap?.querySelector('strong');
    const small = textWrap?.querySelector('small');
    if (strong) strong.textContent = 'Vaultara Capital';
    if (small) small.remove();
    if (textWrap) {
      textWrap.style.display = 'block';
      textWrap.style.lineHeight = '1.05';
    }
  });
}

function addVaultaraSocialLinks() {
  if (document.querySelector('.footer-social')) return;
  const footerBrand = document.querySelector('.site-footer .footer-brand');
  if (!footerBrand) return;

  const social = document.createElement('div');
  social.className = 'footer-social';
  social.setAttribute('aria-label', 'Vaultara Capital social media links');
  social.innerHTML = `
    <a href="https://www.facebook.com/vaultaracapital" target="_blank" rel="noopener" aria-label="Vaultara Capital on Facebook">f</a>
    <a href="https://www.instagram.com/vaultaracapital" target="_blank" rel="noopener" aria-label="Vaultara Capital on Instagram">◎</a>
    <a href="https://www.linkedin.com/company/vaultara-capital" target="_blank" rel="noopener" aria-label="Vaultara Capital on LinkedIn">in</a>
  `;
  footerBrand.appendChild(social);
}

function connectOptionLinks() {
  document.querySelectorAll('a').forEach((link) => {
    const label = (link.textContent || '').trim().toLowerCase();
    if (label.includes('see my options') || label.includes('explore your options')) {
      link.setAttribute('href', 'options.html');
    }
  });
}

function setDailyVaultaraImage() {
  const images = [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2200&q=82',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2200&q=82',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2200&q=82',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2200&q=82',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2200&q=82',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2200&q=82',
    'https://images.unsplash.com/photo-1554224154-26032fced8bd?auto=format&fit=crop&w=2200&q=82'
  ];
  const dayIndex = Math.floor(Date.now() / 86400000) % images.length;
  document.documentElement.style.setProperty('--vaultara-daily-image', `url("${images[dayIndex]}")`);
  document.body.classList.add('vaultara-picture-system');
}

function loadGlobalVaultaraBackgrounds() {
  if (!document.querySelector('link[href="vaultara-backgrounds.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'vaultara-backgrounds.css';
    document.head.appendChild(link);
  }
  if (!document.querySelector('.vaultara-page-bg')) {
    const bg = document.createElement('div');
    bg.className = 'vaultara-page-bg';
    bg.setAttribute('aria-hidden', 'true');
    document.body.prepend(bg);
  }
}

function injectVaultaraStylePolish() {
  if (document.querySelector('#vaultara-polish-style')) return;
  const style = document.createElement('style');
  style.id = 'vaultara-polish-style';
  style.textContent = `
    .network-bar { display: none !important; }
    .wordmark strong { font-size: clamp(20px, 2vw, 26px); letter-spacing: -0.7px; }
    .wordmark-footer strong { color: #fff; }
    .footer-social { display: flex; gap: 12px; margin-top: 18px; flex-wrap: wrap; }
    .footer-social a { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 15px; border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.08); color: #fff; font-weight: 900; font-size: 18px; transition: transform .2s, background .2s; }
    .footer-social a:hover, .footer-social a:focus-visible { transform: translateY(-2px); background: rgba(189,244,231,.18); color: var(--mint); }
    .solution-card, .option-card, .purpose-card { position: relative; overflow: hidden; }
    .solution-card::before, .option-card::before, .purpose-card::before { content: ''; display: block; height: 8px; margin: -34px -34px 26px; background: linear-gradient(90deg, var(--blue), var(--mint-dark)); }
    .option-card::before { margin: -30px -30px 24px; }
    .purpose-card::before { margin: -28px -28px 24px; }
    .featured-card::before, .option-card.featured::before { background: linear-gradient(90deg, var(--mint), var(--gold)); }
    .learning-list { display: grid; gap: 12px; margin: 20px 0 0; padding: 0; list-style: none; color: var(--muted); font-size: 14px; line-height: 1.7; }
    .learning-list li::before { content: '✓'; margin-right: 10px; color: var(--mint-dark); font-weight: 900; }
    @media (max-width: 620px) { .wordmark strong { font-size: 18px; } .footer-social a { width: 44px; height: 44px; } }
  `;
  document.head.appendChild(style);
}

setDailyVaultaraImage();
loadGlobalVaultaraBackgrounds();
injectVaultaraStylePolish();
polishVaultaraBranding();
addVaultaraSocialLinks();
connectOptionLinks();

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
