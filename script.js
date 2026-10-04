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
        window.location.href = 'thank-you.html';
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

function getDateKeyInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function formatBlogDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function showLatestPublishedBlogPost() {
  const section = document.querySelector('[data-latest-blog-post]');
  const schedule = section?.querySelector('[data-blog-schedule]');
  if (!section || !schedule) return;

  let posts;
  try {
    posts = JSON.parse(schedule.textContent);
  } catch {
    return;
  }

  const localDate = getDateKeyInTimeZone(new Date(), 'America/New_York');
  const publishedPosts = posts
    .filter((post) => post.date <= localDate)
    .sort((first, second) => second.date.localeCompare(first.date));
  const latestPost = publishedPosts[0];
  if (!latestPost) {
    section.hidden = true;
    return;
  }

  const meta = section.querySelector('[data-blog-meta]');
  const title = section.querySelector('[data-blog-title]');
  const description = section.querySelector('[data-blog-description]');
  const link = section.querySelector('[data-blog-link]');
  const image = section.querySelector('.home-article-image');

  if (meta) meta.textContent = `${latestPost.label} · ${formatBlogDate(latestPost.date)}`;
  if (title) title.textContent = latestPost.title;
  if (description) description.textContent = latestPost.description;
  if (link) link.href = latestPost.href;
  if (image) image.setAttribute('aria-label', latestPost.imageLabel);
}

function injectVaultaraStylePolish() {
  if (document.querySelector('#vaultara-polish-style')) return;
  const style = document.createElement('style');
  style.id = 'vaultara-polish-style';
  style.textContent = `
    .network-bar { display: none !important; }
    .wordmark strong { font-size: clamp(20px, 2vw, 26px); letter-spacing: -0.7px; }
    .solution-card, .option-card, .purpose-card { position: relative; overflow: hidden; }
    .solution-card::before, .option-card::before, .purpose-card::before { content: ''; display: block; height: 8px; margin: -34px -34px 26px; background: linear-gradient(90deg, var(--blue), var(--mint-dark)); }
    .option-card::before { margin: -30px -30px 24px; }
    .purpose-card::before { margin: -28px -28px 24px; }
    .featured-card::before, .option-card.featured::before { background: linear-gradient(90deg, var(--mint), var(--gold)); }
    .learning-list { display: grid; gap: 12px; margin: 20px 0 0; padding: 0; list-style: none; color: var(--muted); font-size: 14px; line-height: 1.7; }
    .learning-list li::before { content: '✓'; margin-right: 10px; color: var(--mint-dark); font-weight: 900; }
    @media (max-width: 760px) {
      .wordmark strong { font-size: 18px; }
    }
  `;
  document.head.appendChild(style);
}

setDailyVaultaraImage();
loadGlobalVaultaraBackgrounds();
injectVaultaraStylePolish();
polishVaultaraBranding();
addVaultaraSocialLinks();
showLatestPublishedBlogPost();

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

async function connectMarketingContent(){
  try{
    const response=await fetch('/api/marketing/feed',{cache:'no-cache'});
    if(!response.ok)return;
    const feed=await response.json();
    const posts=Array.isArray(feed.items)?feed.items:[];
    const latest=posts.filter(p=>p.type==='blog')[0];
    const feature=document.querySelector('[data-latest-blog-post]');
    if(feature&&latest){
      const set=(selector,text)=>{const el=feature.querySelector(selector);if(el)el.textContent=text;};
      set('[data-blog-meta]','Latest Blog Post · '+new Date(latest.publishAt).toLocaleDateString('en-US',{timeZone:'America/New_York'}));
      set('[data-blog-title]',latest.title);set('[data-blog-description]',latest.summary);
      const link=feature.querySelector('[data-blog-link]');if(link)link.href='/marketing-content?id='+encodeURIComponent(latest.id);
    }
    const main=document.querySelector('main');if(!main)return;
    const path=location.pathname.replace(/\.html$/,'');
    if(!['/','/index','/articles','/blog'].includes(path))return;
    const type=path==='/articles'?'article':path==='/blog'?'blog':null;
    const chosen=posts.filter(p=>!type||p.type===type).slice(0,type?30:4);
    const section=document.createElement('section');section.className='section-light';section.id='marketing-updates';
    const shell=document.createElement('div');shell.className='shell';
    const heading=document.createElement('h2');heading.textContent=type==='article'?'New articles':type==='blog'?'Latest blog posts':'Latest from Vaultara';
    const grid=document.createElement('div');grid.className='home-articles-grid';
    for(const p of chosen){const card=document.createElement('article');card.className='solution-card';const meta=document.createElement('p');meta.className='eyebrow';meta.textContent=p.type+' · '+new Date(p.publishAt).toLocaleDateString('en-US',{timeZone:'America/New_York'});const h=document.createElement('h3');h.textContent=p.title;const summary=document.createElement('p');summary.textContent=p.summary;const a=document.createElement('a');a.textContent='Read '+p.type;a.href='/marketing-content?id='+encodeURIComponent(p.id);card.append(meta,h,summary,a);grid.append(card);}
    if(chosen.length){shell.append(heading,grid);section.append(shell);main.append(section);}
    if(!type&&Array.isArray(feed.news)&&feed.news.length){
      const news=document.createElement('section');news.className='section-light';news.id='marketing-news';const wrap=document.createElement('div');wrap.className='shell';const title=document.createElement('h2');title.textContent='News from the Consumer Financial Protection Bureau';const note=document.createElement('p');note.textContent='Official source links. Publication dates are shown by the source; these are external news updates.';
      const list=document.createElement('ul');for(const n of feed.news.slice(0,6)){try{const u=new URL(n.sourceUrl);if(u.protocol!=='https:'||u.hostname!=='www.consumerfinance.gov')continue;const li=document.createElement('li');const a=document.createElement('a');a.href=u.href;a.textContent=n.title;a.target='_blank';a.rel='noopener';li.append(a);if(n.publishAt){const date=document.createElement('span');date.textContent=' · '+new Date(n.publishAt).toLocaleDateString('en-US');li.append(date);}list.append(li);}catch{}}
      wrap.append(title,note,list);news.append(wrap);main.append(news);
    }
  }catch{/* Existing pages remain usable during a temporary content connection failure. */}
}
connectMarketingContent();
