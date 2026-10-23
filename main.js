const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));

// ---------- intro: logo columns -> wordmark -> tagline -> curtain ----------
const intro=document.querySelector('.intro');
const finish=()=>{document.body.classList.remove('lock');document.body.classList.add('loaded');
  document.querySelectorAll('.hero .reveal').forEach(el=>el.classList.add('in'));
  setTimeout(()=>intro.remove(),1400)};
if(!intro){document.body.classList.add('loaded');document.querySelectorAll('.hero .reveal,.case-hero .reveal').forEach(el=>el.classList.add('in'))}
else if(reduce){intro.remove();document.body.classList.add('loaded');document.querySelectorAll('.hero .reveal').forEach(el=>el.classList.add('in'))}
else{
  document.body.classList.add('lock');
  setTimeout(()=>intro.classList.add('p2'),2600);
  setTimeout(()=>{intro.classList.add('out');setTimeout(finish,500)},4600);
  intro.addEventListener('click',()=>{intro.classList.add('p2','out');finish()});
}

// ---------- words: build scroll-scrubbed reveal for every text block ----------
document.querySelectorAll('.lead,.mid,.team-lead,.bio,.huge,.info p,.info h5,.thesis-text').forEach(el=>el.classList.add('words'));
document.querySelector('.hero .lead')?.classList.remove('words');
document.querySelectorAll('.m-title').forEach(e=>e.classList.add('words'));
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
document.querySelectorAll('.reveal:not(.hero .reveal):not(.case-hero .reveal)').forEach(el=>io.observe(el));
const lock=document.getElementById('lockup');
if(lock){const lo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){lock.classList.add('in');lo.disconnect()}}),{threshold:.35});lo.observe(lock)}

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
if(cur){
let mx=0,my=0,cx=0,cy=0;
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
(function loop(){cx+=(mx-cx)*.2;cy+=(my-cy)*.2;cur.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();
document.querySelectorAll('a,.svc,.work').forEach(el=>{
  el.addEventListener('mouseenter',()=>cur.classList.add('big'));
  el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
});
}

// ---------- services: centered blue box ----------
const sec=document.querySelector('.services');
const panes=[...document.querySelectorAll('.pane')];
const show=i=>{if(!sec)return;sec.classList.add('on');panes.forEach(p=>p.classList.toggle('on',+p.dataset.i===i))};
document.querySelectorAll('.svc').forEach(s=>{
  const i=+s.dataset.i;
  s.addEventListener('mouseenter',()=>show(i));
  s.addEventListener('click',()=>show(i));
});
const box=document.querySelector('.svc-box');
const hide=e=>{if(!e.relatedTarget||!(box?.contains(e.relatedTarget)||e.relatedTarget.closest?.('.svc-list')))sec?.classList.remove('on')};
document.querySelector('.svc-list')?.addEventListener('mouseleave',hide);
box?.addEventListener('mouseleave',hide);
box?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>sec.classList.remove('on')));

// ---------- case pages: Vimeo em loop, sem controles; vídeo/GIF só rodam na tela ----------
document.querySelectorAll('.vid[data-vimeo],.vid[data-youtube]').forEach(v=>{
  const o=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;o.disconnect();
    const f=document.createElement('iframe');
    const yt=v.dataset.youtube;
    f.src=yt?`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&mute=1&loop=1&playlist=${yt}&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0`
            :`https://player.vimeo.com/video/${v.dataset.vimeo}?background=1&autoplay=1&loop=1&muted=1&autopause=0&playsinline=1&dnt=1`;
    f.allow='autoplay; fullscreen; picture-in-picture';f.title=v.dataset.title||'Vídeo do case';f.setAttribute('tabindex','-1');
    f.addEventListener('load',()=>setTimeout(()=>v.classList.add('playing'),yt?2200:900));
    v.append(f);
    if(yt&&v.dataset.sound){
      const b=document.createElement('button');b.type='button';b.className='sound-btn';b.textContent=v.dataset.sound;
      b.addEventListener('click',()=>{
        f.src=`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`;
        v.classList.add('sound');b.remove();
      });
      v.append(b);
    }
  }),{rootMargin:'200px'});o.observe(v);
});
document.querySelectorAll('.loopvid').forEach(v=>{
  const o=new IntersectionObserver(es=>es.forEach(e=>{e.isIntersecting?v.play().catch(()=>{}):v.pause()}),{threshold:.25});o.observe(v);
});

// ---------- hero: lista "O que fazemos" abre o serviço correspondente ----------
document.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',()=>{
  const i=+a.dataset.go;setTimeout(()=>show(i),700);
}));

// ---------- FAQ: accordion ----------
document.querySelectorAll('.faq-q').forEach(b=>b.addEventListener('click',()=>{
  const it=b.parentElement,open=!it.classList.contains('open');
  it.classList.toggle('open',open);b.setAttribute('aria-expanded',open);
}));

// ---------- hero: a imagem de fundo se revela sob o mouse (com parallax suave) ----------
const hb=document.querySelector('.hero-bg');
if(hb&&!reduce){
  const hero=hb.parentElement;
  let tx=.68,ty=.44,x=tx,y=ty,t0=0,moved=false;
  hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=(e.clientY-r.top)/r.height;moved=true});
  hero.addEventListener('mouseleave',()=>{moved=false});
  (function hl(t){
    if(!moved){tx=.68+Math.sin(t/3200)*.12;ty=.44+Math.cos(t/4100)*.1}
    x+=(tx-x)*.07;y+=(ty-y)*.07;
    hb.style.setProperty('--mx',x*100+'%');hb.style.setProperty('--my',y*100+'%');
    hb.style.setProperty('--px',(x-.5).toFixed(3));hb.style.setProperty('--py',(y-.5).toFixed(3));
    requestAnimationFrame(hl);
  })(0);
}

// ---------- hero: distorção de onda (WebGL) sob o mouse; se falhar, fica a imagem simples ----------
if(hb&&!reduce){
  const im=hb.querySelector('img');
  const start=()=>{
    const cv=document.createElement('canvas');
    const gl=cv.getContext('webgl',{premultipliedAlpha:false,antialias:false});
    if(!gl)return;
    const vs='attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0.,1.);}';
    const fs=`precision mediump float;varying vec2 v;uniform sampler2D t;uniform vec2 res,img,m,par;uniform float time,amp;
    void main(){
      float sc=max(res.x/img.x,res.y/img.y);vec2 sz=img*sc/res;
      vec2 uv=(v-.5)/sz*1.0+.5;
      vec2 a=(v-m)*vec2(res.x/res.y,1.);float d=length(a);
      vec2 dir=a/(d+.0001);
      float ring=sin(d*38.-time*3.2)*exp(-d*5.5)*amp;
      float amb=sin(v.y*9.+time*.6)*.0015+sin(v.x*7.-time*.5)*.0012;
      uv+=dir*ring*.022/sz+vec2(amb,amb*.7)/sz;
      uv+=par*.012;
      gl_FragColor=texture2D(t,clamp(uv,0.,1.));
    }`;
    const sh=(ty,s)=>{const o=gl.createShader(ty);gl.shaderSource(o,s);gl.compileShader(o);return o};
    const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return;
    gl.useProgram(pr);
    const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
    [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR));
    [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE));
    const U=n=>gl.getUniformLocation(pr,n);
    const u={res:U('res'),img:U('img'),m:U('m'),par:U('par'),time:U('time'),amp:U('amp')};
    const size=()=>{const r=hb.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);cv.width=r.width*d;cv.height=r.height*d;gl.viewport(0,0,cv.width,cv.height)};
    size();addEventListener('resize',size);
    hb.append(cv);hb.classList.add('gl');
    let amp=0,lx=0,ly=0,on=true;
    new IntersectionObserver(es=>on=es[0].isIntersecting).observe(hb);
    (function draw(t){
      requestAnimationFrame(draw);if(!on)return;
      const mx=parseFloat(hb.style.getPropertyValue('--mx'))/100,my=parseFloat(hb.style.getPropertyValue('--my'))/100;
      const sp=Math.hypot(mx-lx,my-ly);lx=mx;ly=my;
      amp+=(Math.min(1,.35+sp*70)-amp)*.06;
      gl.uniform2f(u.res,cv.width,cv.height);gl.uniform2f(u.img,im.naturalWidth,im.naturalHeight);
      gl.uniform2f(u.m,mx,my);gl.uniform2f(u.par,-(mx-.5),-(my-.5));
      gl.uniform1f(u.time,t/1000);gl.uniform1f(u.amp,amp);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    })(0);
  };
  im.complete&&im.naturalWidth?start():im.addEventListener('load',start);
}
