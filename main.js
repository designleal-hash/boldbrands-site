const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));

// ---------- intro: logo columns -> wordmark -> tagline -> curtain ----------
const intro=document.querySelector('.intro');
const finish=()=>{document.body.classList.remove('lock');document.body.classList.add('loaded');
  document.querySelectorAll('.hero .reveal').forEach(el=>el.classList.add('in'));
  setTimeout(()=>intro.remove(),1400)};
if(reduce){intro.remove();document.body.classList.add('loaded');document.querySelectorAll('.hero .reveal').forEach(el=>el.classList.add('in'))}
else{
  document.body.classList.add('lock');
  setTimeout(()=>intro.classList.add('p2'),2600);
  setTimeout(()=>{intro.classList.add('out');setTimeout(finish,500)},4600);
  intro.addEventListener('click',()=>{intro.classList.add('p2','out');finish()});
}

// ---------- words: build scroll-scrubbed reveal for every text block ----------
document.querySelectorAll('.lead,.mid,.team-lead,.bio,.huge,.info p,.info h5,.thesis-text').forEach(el=>el.classList.add('words'));
document.querySelector('.hero .lead')?.classList.remove('words');
const blocks=[];
document.querySelectorAll('.words').forEach(el=>{
  const ws=[];
  const walk=node=>[...node.childNodes].forEach(ch=>{
    if(ch.nodeType===3){
      const frag=document.createDocumentFragment();
      ch.textContent.split(/(\s+)/).forEach(p=>{
        if(!p.trim()){frag.append(p);return}
        const w=document.createElement('span');w.className='w';
        const s=document.createElement('span');s.textContent=p;
        w.append(s);frag.append(w);ws.push(s);
      });
      ch.replaceWith(frag);
    }else walk(ch);
  });
  walk(el);
  blocks.push({el,ws});
});

// simple reveals (small labels, cards, hero)
document.querySelectorAll('.cards').forEach(g=>[...g.children].forEach((c,i)=>c.style.setProperty('--d',(i*0.14)+'s')));
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
}),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(el=>io.observe(el));
const lock=document.getElementById('lockup');
const lo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){lock.classList.add('in');lo.disconnect()}}),{threshold:.35});
if(lock)lo.observe(lock);

// ---------- scroll loop ----------
const nav=document.querySelector('.nav'),glow=document.querySelector('.hero-glow');
function tick(){
  const vh=innerHeight;
  nav.classList.toggle('scrolled',scrollY>40);
  if(glow)glow.style.transform=`translateY(${scrollY*.25}px)`;
  blocks.forEach(({el,ws})=>{
    const r=el.getBoundingClientRect();
    if(r.bottom<-50||r.top>vh+50)return;
    // progress: 0 when block top enters at 92% of viewport, 1 when top reaches ~40%
    const p=reduce?1:clamp((vh*.92-r.top)/(vh*.5+Math.min(r.height,vh)*.3));
    const n=ws.length;
    ws.forEach((s,i)=>{
      const wp=clamp(p*(n+6)/6-(i/n)*(n/6)*.9,0,1);
      s.style.opacity=wp;
      s.style.transform=`translateY(${(1-wp)*105}%)`;
    });
  });
}
addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick);
tick();

// parallax for team cards
const mem=document.querySelectorAll('.member figure img');
addEventListener('scroll',()=>mem.forEach(im=>{
  const r=im.parentElement.getBoundingClientRect();
  im.style.translate=`0 ${(r.top-innerHeight/2)*-.03}px`;
}),{passive:true});

// ---------- cursor ----------
const cur=document.querySelector('.cursor');
let mx=0,my=0,cx=0,cy=0;
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
(function loop(){cx+=(mx-cx)*.2;cy+=(my-cy)*.2;cur.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();
document.querySelectorAll('a,.svc,.work').forEach(el=>{
  el.addEventListener('mouseenter',()=>cur.classList.add('big'));
  el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
});

// ---------- services: centered blue box ----------
const sec=document.querySelector('.services');
const panes=[...document.querySelectorAll('.pane')];
const show=i=>{sec.classList.add('on');panes.forEach(p=>p.classList.toggle('on',+p.dataset.i===i))};
document.querySelectorAll('.svc').forEach(s=>{
  const i=+s.dataset.i;
  s.addEventListener('mouseenter',()=>show(i));
  s.addEventListener('click',()=>show(i));
});
document.querySelector('.svc-list').addEventListener('mouseleave',()=>sec.classList.remove('on'));
