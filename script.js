document.addEventListener('DOMContentLoaded', ()=>{
  // Set year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav toggle for mobile
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  if(navToggle && siteNav){
    navToggle.addEventListener('click', ()=>{
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      siteNav.style.display = expanded ? '' : 'block';
    });
    siteNav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
      if(window.innerWidth < 700){ siteNav.style.display=''; navToggle.setAttribute('aria-expanded','false'); }
    }));
  }

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle){
    let dark = true;
    const applyTheme = (d)=>{
      // 1. Set background, card, and accent colors
      document.documentElement.style.setProperty('--bg', d? '#0b1220':'#f7fafc');
      document.documentElement.style.setProperty('--card', d? '#0f1724':'#ffffff');
      document.documentElement.style.setProperty('--accent', d? '#3b82f6':'#2563eb');
      
      // 2. Set the global primary text color (Fixes brand and header text)
      document.documentElement.style.setProperty('color', d? '#e6eef8':'#1f2937'); 
      
      // 3. Set the MUTED text color (Fixes secondary/description text contrast)
      document.documentElement.style.setProperty('--muted', d? '#9ca3af':'#6b7280');
      
      // 4. Set button text (Action to switch to the opposite mode)
      themeToggle.textContent = d? 'Light':'Dark'; 
      themeToggle.setAttribute('aria-pressed', String(d));
    };
    // Apply initial theme settings
    applyTheme(dark);
    
    // Toggle logic
    themeToggle.addEventListener('click', ()=>{ dark=!dark; applyTheme(dark); });
  }

  // Projects modal
  const projects = document.querySelectorAll('.project');
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalLinks = document.getElementById('modalLinks');
  const modalClose = document.getElementById('modalClose');

  const openModal = (title, desc, links)=>{
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalLinks.innerHTML = '';
    try{
      const parsed = JSON.parse(links);
      parsed.forEach(l=>{
        const a = document.createElement('a');
        a.href = l.url; a.rel='noopener'; a.textContent=l.label; a.target='_blank';
        modalLinks.appendChild(a);
      });
    }catch(e){}
  };
  const closeModal = ()=>{ if(modal) modal.setAttribute('aria-hidden','true'); };
  projects.forEach(p=>{
    p.addEventListener('click', ()=> openModal(p.dataset.title,p.dataset.desc,p.dataset.links));
    p.addEventListener('keypress', e=>{ if(e.key==='Enter'||e.key===' ') openModal(p.dataset.title,p.dataset.desc,p.dataset.links); });
  });
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modal) modal.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });

  // Contact form demo handler
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name'), email=formData.get('email'), message=formData.get('message');
      if(!name || !email || !message){ if(status) status.textContent='Please complete all fields.'; return; }
      if(status) status.textContent='Sending message...';
      setTimeout(()=>{ if(status) status.textContent='Thanks! Your message was sent (demo).'; form.reset(); },900);
    });
  }

  // Typewriter
  const typedPhrases = ["interactive UIs.","performant front-ends.","accessible apps.","small research tools."];
  const el = document.getElementById('typed');
  if(el){
    let phraseIndex=0,charIndex=0,forward=true;
    const wait=1500;
    const tick = ()=>{
      const phrase = typedPhrases[phraseIndex];
      if(forward){
        el.textContent = phrase.slice(0,++charIndex);
        if(charIndex===phrase.length){ forward=false; setTimeout(tick,wait); return; }
      } else {
        el.textContent = phrase.slice(0,--charIndex);
        if(charIndex===0){ forward=true; phraseIndex=(phraseIndex+1)%typedPhrases.length; }
      }
      setTimeout(tick, forward?80:30);
    };
    tick();
  }

  // Reveal + skill bars
  const reveals = document.querySelectorAll('.reveal');
  const skills = document.querySelectorAll('.skill-bar');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('active');
        if(e.target.classList.contains('skill-bar')){
          const fill = e.target.querySelector('.skill-fill');
          const level = Number(e.target.dataset.level||0);
          if(fill) fill.style.width = level+'%';
        }
      }
    });
  },{threshold:0.18});
  document.querySelectorAll('section,.card,.project,.hero-copy,.about,.contact,.sidebar').forEach(n=>{ n.classList.add('reveal'); obs.observe(n); });
  document.querySelectorAll('.skill-bar').forEach(b=>obs.observe(b));

  // Particles
  const canvas = document.createElement('canvas'); canvas.id='particleCanvas'; document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d'); let w=canvas.width=innerWidth, h=canvas.height=innerHeight;
  const particles=[]; const count=Math.max(18,Math.floor((w*h)/90000));
  function rand(min,max){return Math.random()*(max-min)+min;}
  function init(){ particles.length=0; for(let i=0;i<count;i++) particles.push({x:rand(0,w),y:rand(0,h),r:rand(0.5,2.6),vx:rand(-0.25,0.25),vy:rand(-0.15,0.15),alpha:rand(0.15,0.6)});}
  function resize(){ w=canvas.width=innerWidth; h=canvas.height=innerHeight; init();}
  addEventListener('resize',resize);
  function step(){ ctx.clearRect(0,0,w,h); particles.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<-10)p.x=w+10;if(p.x>w+10)p.x=-10;if(p.y<-10)p.y=h+10;if(p.y>h+10)p.y=-10; ctx.beginPath(); ctx.fillStyle=`rgba(59,130,246,${p.alpha})`; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }); requestAnimationFrame(step);}
  init(); step();
});