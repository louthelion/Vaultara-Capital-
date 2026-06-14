const imageSets={
 hero:['photo-1560518883-ce09059eeffa','photo-1600585154340-be6161a56a0c','photo-1600607687939-ce8a6c25118c'],
 house:['photo-1600585154340-be6161a56a0c','photo-1600566753086-00f18fb6b3ea','photo-1600047509807-ba8f99d2cdde'],
 acquisition:['photo-1600607687920-4e2a09cf159d','photo-1600566753190-17f0baa2a6c3','photo-1600607688969-a5bfcd646154'],
 keys:['photo-1560518883-ce09059eeffa','photo-1582407947304-fd86f028f716','photo-1564013799919-ab600027ffc6'],
 apartment:['photo-1486406146926-c627a92ad1ab','photo-1545324418-cc1a3fa10c00','photo-1460317442991-0ec209397118'],
 neighborhood:['photo-1564013799919-ab600027ffc6','photo-1511818966892-d7d671e672a2','photo-1449844908441-8829872d2607'],
 contracts:['photo-1450101499163-c8848c66ca85','photo-1554224155-8d04cb21cd6c','photo-1554224154-26032ffc0d07'],
 office:['photo-1497366754035-f200968a6e72','photo-1497366811353-6870744d04b2','photo-1524758631624-e2822e304c36']
};
const day=Math.floor(Date.now()/86400000);
document.querySelectorAll('[data-image-set]').forEach(el=>{const set=imageSets[el.dataset.imageSet]||imageSets.hero;const id=set[day%set.length];el.style.backgroundImage=`url('https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=85')`;});
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-header nav');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);toggle.textContent=open?'✕':'☰';});
document.getElementById('year').textContent=new Date().getFullYear();
