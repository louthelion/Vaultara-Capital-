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
const isMarketingArchive=marketingPath.endsWith('-archive');
const marketingPages=['/','/index','/articles','/blog','/article-archive','/blog-archive','/news-archive'];
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
  const anchor=main.querySelector('.home-articles-preview,.blog-section,.library-section,.archive-library');
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
    .marketing-card{display:flex;flex-direction:column;background:#fff;border:1px solid #dce4ee;border-top:4px solid #0a68e8;border-radius:18px;padding:26px;min-width:0;box-shadow:0 8px 24px rgba(6,26,58,.04)}
    .marketing-archive-links{line-height:2}.marketing-archive-links a{color:#0758bf;font-weight:700}.archive-filters{display:flex;gap:20px;flex-wrap:wrap;margin:20px 0}.archive-filters select{padding:10px;border:1px solid #b7c5d8;border-radius:8px;background:white;color:#061a3a}.archive-groups{display:block}.archive-groups>section{margin-bottom:36px}.marketing-card h4{font-size:23px;line-height:1.3;margin:10px 0;color:#061a3a}.marketing-card h3{font-size:23px;line-height:1.3;margin:10px 0;color:#061a3a}
    .marketing-card p{color:#52637c;line-height:1.65}
    .marketing-card .marketing-meta{font-size:12px;font-weight:700;color:#3265a3;margin:0}
    .marketing-card a{display:inline-block;margin-top:auto;padding:12px 18px;border-radius:10px;background:#edf4ff;align-self:flex-start;color:#0758bf;font-weight:700;line-height:1.5;overflow-wrap:anywhere}
    .marketing-card:first-child{grid-column:1/-1}.marketing-refresh{border:1px solid #b7c5d8;border-radius:10px;padding:12px 18px;background:white;color:#0758bf;font-weight:700;cursor:pointer;margin:0 0 20px}.marketing-refresh:disabled{opacity:.6;cursor:wait}
    @media(max-width:640px){.marketing-grid{grid-template-columns:1fr}.marketing-section{padding:34px 0}.marketing-card{padding:22px}}
  `;document.head.append(style);
  marketingSection('marketing-updates',isMarketingArchive?'Browse by year and month':marketingPath.includes('article')?'Latest articles':marketingPath.includes('blog')?'Latest blog posts':'Latest from Vaultara');
  if(!isMarketingArchive){const newsSection=marketingSection('marketing-news','Credit, economy & business news');const button=document.createElement('button');button.type='button';button.className='marketing-refresh';button.textContent='Refresh news';button.addEventListener('click',()=>connectMarketingContent(true));newsSection.querySelector('.shell').insertBefore(button,newsSection.querySelector('.marketing-status'));}
  const archives=document.createElement('p');archives.className='marketing-archive-links';
  for(const [label,url] of [['Blog Archive','/blog-archive'],['Article Archive','/article-archive'],['News Archive','/news-archive']]){const a=document.createElement('a');a.href=url;a.textContent=label;archives.append(a,document.createTextNode(' · '));}
  document.querySelector('#marketing-updates .shell').insertBefore(archives,document.querySelector('#marketing-updates .marketing-status'));
  if(isMarketingArchive)setupArchiveFilters();
  for(const nav of document.querySelectorAll('.desktop-nav,.mobile-nav')){
    const link=document.createElement('a');link.href=isMarketingArchive?'/news-archive':'#marketing-news';link.textContent='News';link.addEventListener('click',closeMenu);nav.append(link);
  }
  document.querySelector('#marketing-updates .marketing-status').textContent='Loading published content…';
  const newsStatus=document.querySelector('#marketing-news .marketing-status');if(newsStatus)newsStatus.textContent='Loading official news…';
}

const legacyArchiveItems=[...document.querySelectorAll('.archive-library .archive-card')].map(card=>({
 title:card.querySelector('h2,h3')?.textContent,
 summary:card.querySelector('.card-copy>p:not(.archive-kicker)')?.textContent||card.querySelector('p:not(.archive-kicker)')?.textContent||'',
 publishAt:card.querySelector('time')?.getAttribute('datetime')+'T12:00:00Z',
 href:card.querySelector('a')?.getAttribute('href'),
 type:marketingPath.includes('article')?'article':'blog'
}));
let archiveRecords=[];
function setupArchiveFilters(){
 const wrap=document.createElement('div');wrap.className='archive-filters';
 for(const [name,label] of [['year','Year'],['month','Month']]){
  const control=document.createElement('label');control.textContent=label+' ';
  const select=document.createElement('select');select.id='archive-'+name;select.setAttribute('aria-label','Archive '+name);select.addEventListener('change',drawArchive);
  control.append(select);wrap.append(control);
 }
 document.querySelector('#marketing-updates .shell').insertBefore(wrap,document.querySelector('#marketing-updates .marketing-grid'));
}
function renderDatedArchive(feed){
 const type=marketingPath.includes('news')?'news':marketingPath.includes('article')?'article':'blog';
 const today=getDateKeyInTimeZone(new Date(),'America/New_York');
 const source=type==='news'?(feed.news||[]):(feed.items||[]).filter(x=>x.type===type);
 const seen=new Set();archiveRecords=[];
 for(const item of [...source,...(type==='news'?[]:legacyArchiveItems)]){
  const date=new Date(item.publishAt||item.firstSeenAt);if(!Number.isFinite(date.getTime()))continue;
  const dateKey=getDateKeyInTimeZone(date,'America/New_York');if(dateKey>=today)continue;
  let href=item.href||'/marketing-content?id='+encodeURIComponent(item.id);
  if(type==='news'){try{const u=new URL(item.sourceUrl);if(u.protocol!=='https:'||!['www.consumerfinance.gov','consumerfinance.gov','www.federalreserve.gov','federalreserve.gov','www.sba.gov','sba.gov','legacy.sba.gov','www.ftc.gov','ftc.gov','consumer.ftc.gov','www.bls.gov','bls.gov','www.bea.gov','bea.gov','home.treasury.gov'].includes(u.hostname))continue;if(!item.id)continue;href='/marketing-content?news='+encodeURIComponent(item.id);}catch{continue;}}
  const key=item.id||href;if(seen.has(key))continue;seen.add(key);
  archiveRecords.push({...item,href,dateKey,type});
 }
 archiveRecords.sort((a,b)=>b.dateKey.localeCompare(a.dateKey));
 const years=[...new Set(archiveRecords.map(x=>x.dateKey.slice(0,4)))];
 const y=document.getElementById('archive-year'),m=document.getElementById('archive-month');const selected=y.value;
 y.replaceChildren(new Option('All years',''),...years.map(x=>new Option(x,x)));if(years.includes(selected))y.value=selected;
 if(!m.options.length)m.replaceChildren(new Option('All months',''),...Array.from({length:12},(_,i)=>new Option(new Date(2020,i,1).toLocaleString('en-US',{month:'long'}),String(i+1).padStart(2,'0'))));
 for(const legacy of document.querySelectorAll('.archive-library'))legacy.hidden=true;
 drawArchive();
}
function drawArchive(){
 const y=document.getElementById('archive-year').value,m=document.getElementById('archive-month').value;
 const items=archiveRecords.filter(x=>(!y||x.dateKey.startsWith(y))&&(!m||x.dateKey.slice(5,7)===m));
 const grid=document.querySelector('#marketing-updates .marketing-grid');grid.classList.add('archive-groups');
 const groups=new Map();for(const item of items){const month=item.dateKey.slice(0,7);if(!groups.has(month))groups.set(month,[]);groups.get(month).push(item);}
 const nodes=[];
 for(const [month,records] of groups){
  const group=document.createElement('section');const h=document.createElement('h3');
  h.textContent=new Date(month+'-15T12:00:00Z').toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'America/New_York'});group.append(h);
  const cards=document.createElement('div');cards.className='marketing-grid';
  for(const item of records){
   const card=document.createElement('article');card.className='marketing-card';
   const time=document.createElement('time');time.className='marketing-meta';time.dateTime=item.dateKey;time.textContent=formatBlogDate(item.dateKey);
   const title=document.createElement('h4');title.textContent=item.title;
   const summary=document.createElement('p');summary.textContent=item.summary||'';
   const link=document.createElement('a');link.href=item.href;link.textContent='Read more →';
   if(item.type==='news'&&!item.id){link.target='_blank';link.rel='noopener';}
   card.append(time,title,summary,link);cards.append(card);
  }
  group.append(cards);nodes.push(group);
 }
 grid.replaceChildren(...nodes);
 document.querySelector('#marketing-updates .marketing-status').textContent=items.length?items.length+' earlier publication'+(items.length===1?'':'s')+' · Original dates and links preserved.':'No earlier publications match this year and month.';
}
let marketingLoading=false;
async function connectMarketingContent(force=false){
  if(!marketingPages.includes(marketingPath)||marketingLoading)return;
  marketingLoading=true;
  const refreshButton=document.querySelector('.marketing-refresh');if(refreshButton){refreshButton.disabled=true;refreshButton.textContent='Refreshing…';}
  try{
    const query=new URLSearchParams();if(isMarketingArchive)query.set('archive','1');if(force)query.set('refresh',String(Date.now()));
    const response=await fetch('/api/marketing/feed'+(query.size?'?'+query.toString():''),{cache:'no-store'});
    if(!response.ok)throw Error('Content connection unavailable');
    const feed=await response.json();
    const posts=(Array.isArray(feed.items)?feed.items:[]).filter(p=>['blog','article'].includes(p.type)&&Date.parse(p.publishAt)<=Date.now()).sort((a,b)=>Date.parse(b.publishAt)-Date.parse(a.publishAt));
    const today=getDateKeyInTimeZone(new Date(),'America/New_York');
    if(isMarketingArchive){renderDatedArchive(feed);return;}
    const current=posts;
    const latest=current.find(p=>p.type==='blog');
    const feature=document.querySelector('[data-latest-blog-post]');
    if(feature)feature.hidden=!latest;
    if(feature&&latest){
      const set=(selector,text)=>{const el=feature.querySelector(selector);if(el)el.textContent=text;};
      set('[data-blog-meta]','Latest Blog Post · '+new Date(latest.publishAt).toLocaleDateString('en-US',{timeZone:'America/New_York'}));
      set('[data-blog-title]',latest.title);set('[data-blog-description]',latest.summary);
      feature.querySelector('[data-blog-link]').href='/marketing-content?id='+encodeURIComponent(latest.id);
    }
    const type=marketingPath.includes('article')?'article':marketingPath.includes('blog')?'blog':null;
    const chosen=current.filter(p=>!type||p.type===type).slice(0,type?30:4);
    const section=document.getElementById('marketing-updates');const grid=section.querySelector('.marketing-grid');
    const cards=[];
    for(const p of chosen){
      const card=document.createElement('article');card.className='marketing-card';
      const meta=document.createElement('p');meta.className='marketing-meta';meta.textContent=p.type.toUpperCase()+' · '+new Date(p.publishAt).toLocaleDateString('en-US',{timeZone:'America/New_York'});
      const h=document.createElement('h3');h.textContent=p.title;
      const summary=document.createElement('p');summary.textContent=p.summary;
      const a=document.createElement('a');a.textContent='Read more →';a.href='/marketing-content?id='+encodeURIComponent(p.id);
      card.append(meta,h,summary,a);cards.push(card);
    }
    grid.replaceChildren(...cards);
    section.querySelector('.marketing-status').textContent=chosen.length?'Publication schedule: blogs Tuesday and Friday; articles Thursday, at 8 AM Eastern. Latest publications stay visible; browse older dates in the archives.':'No published '+(type||'post')+' is available yet. Blogs publish Tuesday and Friday; articles Thursday, at 8 AM Eastern. Earlier publications remain in the archives.';
    for(const older of document.querySelectorAll('.home-articles-preview,.blog-section,.library-section'))older.hidden=true;
    const news=document.getElementById('marketing-news');const newsCards=[];
    for(const n of (Array.isArray(feed.news)?feed.news:[]).slice(0,8)){
      try{
        const u=new URL(n.sourceUrl);if(u.protocol!=='https:'||!['www.consumerfinance.gov','consumerfinance.gov','www.federalreserve.gov','federalreserve.gov','www.sba.gov','sba.gov','legacy.sba.gov','www.ftc.gov','ftc.gov','consumer.ftc.gov','www.bls.gov','bls.gov','www.bea.gov','bea.gov','home.treasury.gov'].includes(u.hostname))continue;
        const card=document.createElement('article');card.className='marketing-card';
        const meta=document.createElement('p');meta.className='marketing-meta';meta.textContent=(n.kind==='daily-brief'?'DAILY BRIEF':n.source||'OFFICIAL NEWS')+(n.publishAt?' · '+new Date(n.publishAt).toLocaleDateString('en-US',{timeZone:'America/New_York'}):'');
        const h=document.createElement('h3');h.textContent=n.title;
        const summary=document.createElement('p');summary.textContent=n.summary||'Read the complete announcement on Vaultara Capital.';
        const a=document.createElement('a');if(!n.id)continue;a.href='/marketing-content?news='+encodeURIComponent(n.id);a.textContent='Read more →';
        card.append(meta,h,summary,a);newsCards.push(card);
      }catch{}
    }
    news.querySelector('.marketing-grid').replaceChildren(...newsCards);
    const historyLink=document.createElement('a');historyLink.href='/news-archive';historyLink.textContent='Browse News Archive →';news.querySelector('.shell').append(historyLink);
    for(const oldLink of [...news.querySelectorAll('a[href="/news-archive"]')].slice(0,-1))oldLink.remove();
    const refreshed=feed.newsUpdatedAt?new Date(feed.newsUpdatedAt).toLocaleString('en-US',{timeZone:'America/New_York'}):null;
    news.querySelector('.marketing-status').textContent=newsCards.length?'Daily credit, economy and business briefing: 8 AM Eastern. Official source checks run hourly'+(refreshed?' · Last successful check: '+refreshed+' Eastern.':'.')+' Current announcements and background education are labelled separately. Read the full briefing here on Vaultara Capital.':'News is temporarily unavailable. Previous headlines remain in the News Archive. Checked every day, hourly'+(refreshed?' · Last check: '+refreshed+' Eastern.':'.');
  }catch{
    for(const id of ['marketing-updates','marketing-news']){
      const section=document.getElementById(id);if(section)section.querySelector('.marketing-status').textContent='Updates could not be refreshed. Any previously loaded content remains visible. Please try again shortly.';
    }
  }finally{marketingLoading=false;if(refreshButton){refreshButton.disabled=false;refreshButton.textContent='Refresh news';}}
}
setupMarketing();
connectMarketingContent();
if(marketingPages.includes(marketingPath)){
  setInterval(()=>{if(!document.hidden)connectMarketingContent();},600000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)connectMarketingContent();});
}
