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

function addVaultaraHelpGuide() {
  const host=document.createElement('section');
  host.setAttribute('aria-label','Vaultara website help');
  Object.assign(host.style,{position:'fixed',bottom:'18px',right:'18px',zIndex:'1000',maxWidth:'min(350px, calc(100vw - 36px))'});
  const toggle=document.createElement('button');toggle.type='button';toggle.textContent='Website help';
  Object.assign(toggle.style,{background:'#1458ce',color:'#fff',border:'0',borderRadius:'12px',padding:'14px 20px',fontWeight:'700',cursor:'pointer'});
  const box=document.createElement('div');box.hidden=true;
  Object.assign(box.style,{background:'#fff',color:'#172b4d',border:'1px solid #cfd9e8',borderRadius:'14px',padding:'20px',marginBottom:'10px',boxShadow:'0 12px 40px #172b4d22'});
  const title=document.createElement('h2');title.textContent='How can we help?';title.style.fontSize='20px';box.append(title);
  const note=document.createElement('p');note.textContent='Choose a topic. This guide uses published information; live AI assistance is not activated.';box.append(note);
  const answers=[
    ['Funding information','We help organize funding readiness questions and documents. An inquiry is not a loan application or approval.','funding.html'],
    ['Credit information','Learn about credit readiness. Paid credit improvement services require compliance verification; no score increase is guaranteed.','credit.html'],
    ['Business setup','Explore administrative formation checklists. Legal and tax decisions require appropriate professional advice.','formation.html'],
    ['News and education','Read our published blog and learning articles. These pages are not yet connected to automatic live research.','learning-center.html'],
    ['Send an inquiry','Use the website inquiry form. Do not submit Social Security numbers, passwords, banking credentials, or credit reports.','index.html#contact']
  ];
  const response=document.createElement('p');response.setAttribute('role','status');
  answers.forEach(([label,text,url])=>{const b=document.createElement('button');b.type='button';b.textContent=label;Object.assign(b.style,{display:'block',width:'100%',textAlign:'left',padding:'10px',margin:'6px 0',background:'#eef3ff',color:'#1458ce',border:'0',borderRadius:'8px',cursor:'pointer'});b.onclick=()=>{response.replaceChildren(document.createTextNode(text+' '));const link=document.createElement('a');link.href=url;link.textContent='Open page';response.append(link)};box.append(b)});
  box.append(response);toggle.setAttribute('aria-expanded','false');toggle.onclick=()=>{box.hidden=!box.hidden;toggle.setAttribute('aria-expanded',String(!box.hidden));toggle.textContent=box.hidden?'Website help':'Close help'};host.append(box,toggle);document.body.append(host);
}
addVaultaraHelpGuide();

function setupContentArchive(){
 const cards=[...document.querySelectorAll('.archive-card')].filter(c=>c.querySelector('time[datetime]'));
 if(!cards.length)return;
 const style=document.createElement('style');style.textContent='.archive-card[hidden]{display:none!important}.archive-filter-field{display:grid;gap:6px;font-size:13px;font-weight:700}.archive-filter-field input,.archive-filter-field select{min-height:42px;padding:8px;border:1px solid #cfd9e8;border-radius:8px;max-width:100%}';document.head.append(style);
 const panel=document.createElement('section');panel.setAttribute('aria-label','Filter archive');
 panel.style.cssText='display:flex;flex-wrap:wrap;gap:12px;margin:0 0 24px;padding:18px;background:#fff;border-radius:14px;color:#061a3a';
 const search=document.createElement('input');search.type='search';search.placeholder='Search past posts';search.setAttribute('aria-label','Search archive');
 const day=document.createElement('input');day.type='date';day.setAttribute('aria-label','Publication day');
 const month=document.createElement('select');month.setAttribute('aria-label','Publication month');
 const year=document.createElement('select');year.setAttribute('aria-label','Publication year');
 const option=(v,t)=>{const o=document.createElement('option');o.value=v;o.textContent=t;return o};
 month.append(option('','All months'));for(let n=1;n<=12;n++)month.append(option(String(n).padStart(2,'0'),new Intl.DateTimeFormat('en',{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(2026,n-1,1)))));
 year.append(option('','All years'));[...new Set(cards.map(c=>c.querySelector('time').dateTime.slice(0,4)))].sort().reverse().forEach(y=>year.append(option(y,y)));
 const reset=document.createElement('button');reset.type='button';reset.textContent='Clear filters';reset.className='button';
 const result=document.createElement('p');result.setAttribute('role','status');
 const field=(label,input)=>{const wrap=document.createElement('label');wrap.className='archive-filter-field';wrap.append(document.createTextNode(label),input);return wrap};
 panel.append(field('Search',search),field('Publication day',day),field('Month',month),field('Year',year),reset);const library=document.querySelector('.archive-library .shell');if(library)library.prepend(panel);else cards[0].parentElement.before(panel);panel.after(result);
 const filter=()=>{let count=0;cards.forEach(c=>{const d=c.querySelector('time').dateTime;const match=(!day.value||d===day.value)&&(!month.value||d.slice(5,7)===month.value)&&(!year.value||d.slice(0,4)===year.value)&&c.textContent.toLowerCase().includes(search.value.toLowerCase());c.hidden=!match;if(match)count++});result.textContent=count+' matching posts';};
 [search,day,month,year].forEach(el=>el.addEventListener('input',filter));reset.onclick=()=>{search.value=day.value=month.value=year.value='';filter()};filter();
}
setupContentArchive();
