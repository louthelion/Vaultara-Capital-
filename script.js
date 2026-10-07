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


const marketingPath=location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
const marketingPages=['/','/index','/articles','/blog','/article-archive','/blog-archive'];
function marketingSection(id,title){
  let section=document.getElementById(id);
  if(section)return section;
  section=document.createElement('section');section.id=id;section.className='marketing-section';
  const wrap=document.createElement('div');wrap.className='shell';
  const heading=document.createElement('h2');heading.textContent=title;
  const status=document.createElement('p');status.className='marketing-status';status.setAttribute('role','status');
  const grid=document.createElement('div');grid.className='marketing-grid';
  wrap.append(heading,status,grid);section.append(wrap);
  const main=document.querySelector('main');
  const anchor=main.querySelector('.home-articles-preview,.blog-section,.library-section');
  if(anchor)main.insertBefore(section,anchor);else main.insertBefore(section,main.children[1]||null);
  return section;
}
function setupMarketing(){
  if(!marketingPages.includes(marketingPath)||!document.querySelector('main'))return;
  const style=document.createElement('style');style.textContent=`
    .marketing-section{padding:48px 0;background:#f4f7fc;color:#061a3a;scroll-margin-top:100px}
    .marketing-section h2{font-family:Georgia,serif;font-size:clamp(30px,4vw,44px);line-height:1.15;margin:0 0 14px;color:#061a3a}
    .marketing-status{color:#52637c;line-height:1.7;margin:0 0 24px;font-size:14px}
    .marketing-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
    .marketing-card{background:#fff;border:1px solid #dce4ee;border-top:4px solid #0a68e8;border-radius:18px;padding:26px;min-width:0;box-shadow:0 8px 24px rgba(6,26,58,.04)}
    .marketing-card h3{font-size:23px;line-height:1.3;margin:10px 0;color:#061a3a}
    .marketing-card p{color:#52637c;line-height:1.65}
    .marketing-card .marketing-meta{font-size:12px;font-weight:700;color:#3265a3;margin:0}
    .marketing-card a{display:inline-block;color:#0758bf;font-weight:700;line-height:1.5;overflow-wrap:anywhere}
    @media(max-width:640px){.marketing-grid{grid-template-columns:1fr}.marketing-section{padding:34px 0}.marketing-card{padding:22px}}
  `;document.head.append(style);
  marketingSection('marketing-updates',marketingPath.includes('article')?'Latest articles':marketingPath.includes('blog')?'Latest blog posts':'Latest from Vaultara');
  marketingSection('marketing-news','News · official source updates');
  for(const nav of document.querySelectorAll('.desktop-nav,.mobile-nav')){
    const link=document.createElement('a');link.href='#marketing-news';link.textContent='News';link.addEventListener('click',closeMenu);nav.append(link);
  }
  document.querySelector('#marketing-updates .marketing-status').textContent='Loading published content…';
  document.querySelector('#marketing-news .marketing-status').textContent='Loading official news…';
}
let marketingLoading=false;
async function connectMarketingContent(){
  if(!marketingPages.includes(marketingPath)||marketingLoading)return;
  marketingLoading=true;
  try{
    const response=await fetch('/api/marketing/feed',{cache:'no-store'});
    if(!response.ok)throw Error('Content connection unavailable');
    const feed=await response.json();
    const posts=(Array.isArray(feed.items)?feed.items:[]).filter(p=>['blog','article'].includes(p.type)&&Date.parse(p.publishAt)<=Date.now()).sort((a,b)=>Date.parse(b.publishAt)-Date.parse(a.publishAt));
    const latest=posts.find(p=>p.type==='blog');
    const feature=document.querySelector('[data-latest-blog-post]');
    if(feature&&latest){
      const set=(selector,text)=>{const el=feature.querySelector(selector);if(el)el.textContent=text;};
      set('[data-blog-meta]','Latest Blog Post · '+new Date(latest.publishAt).toLocaleDateString('en-US',{timeZone:'America/New_York'}));
      set('[data-blog-title]',latest.title);set('[data-blog-description]',latest.summary);
      feature.querySelector('[data-blog-link]').href='/marketing-content?id='+encodeURIComponent(latest.id);
    }
    const type=marketingPath.includes('article')?'article':marketingPath.includes('blog')?'blog':null;
    const chosen=posts.filter(p=>!type||p.type===type).slice(0,type?30:4);
    const section=document.getElementById('marketing-updates');const grid=section.querySelector('.marketing-grid');
    const cards=[];
    for(const p of chosen){
      const card=document.createElement('article');card.className='marketing-card';
      const meta=document.createElement('p');meta.className='marketing-meta';meta.textContent=p.type.toUpperCase()+' · '+new Date(p.publishAt).toLocaleDateString('en-US',{timeZone:'America/New_York'});
      const h=document.createElement('h3');h.textContent=p.title;
      const summary=document.createElement('p');summary.textContent=p.summary;
      const a=document.createElement('a');a.textContent='Read '+p.type+' →';a.href='/marketing-content?id='+encodeURIComponent(p.id);
      card.append(meta,h,summary,a);cards.push(card);
    }
    grid.replaceChildren(...cards);
    section.querySelector('.marketing-status').textContent=chosen.length?'Published content, newest first. New posts appear on their scheduled publication date.':'No new '+(type||'post')+' has been published yet. Earlier guides remain available below; new posts appear on their scheduled date.';
    const news=document.getElementById('marketing-news');const newsCards=[];
    for(const n of (Array.isArray(feed.news)?feed.news:[]).slice(0,8)){
      try{
        const u=new URL(n.sourceUrl);if(u.protocol!=='https:'||u.hostname!=='www.consumerfinance.gov')continue;
        const card=document.createElement('article');card.className='marketing-card';
        const meta=document.createElement('p');meta.className='marketing-meta';meta.textContent='CFPB'+(n.publishAt?' · '+new Date(n.publishAt).toLocaleDateString('en-US',{timeZone:'America/New_York'}):'');
        const h=document.createElement('h3');h.textContent=n.title;
        const a=document.createElement('a');a.href=u.href;a.textContent='Read official source ↗';a.target='_blank';a.rel='noopener';
        card.append(meta,h,a);newsCards.push(card);
      }catch{}
    }
    news.querySelector('.marketing-grid').replaceChildren(...newsCards);
    const refreshed=feed.newsUpdatedAt?new Date(feed.newsUpdatedAt).toLocaleString('en-US',{timeZone:'America/New_York'}):null;
    news.querySelector('.marketing-status').textContent=newsCards.length?'Consumer Financial Protection Bureau headlines. Checked hourly'+(refreshed?' · Last successful check: '+refreshed+' Eastern.':'.')+' Source dates are shown on each story.':'Official news is temporarily unavailable. Please check again shortly.';
  }catch{
    for(const id of ['marketing-updates','marketing-news']){
      const section=document.getElementById(id);if(section)section.querySelector('.marketing-status').textContent='Updates could not be refreshed. Any previously loaded content remains visible. Please try again shortly.';
    }
  }finally{marketingLoading=false;}
}
setupMarketing();
connectMarketingContent();
if(marketingPages.includes(marketingPath)){
  setInterval(()=>{if(!document.hidden)connectMarketingContent();},600000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)connectMarketingContent();});
}
