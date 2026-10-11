/* =========================================================
   자취 가이드 · 공통 스크립트
   localStorage 키는 기존 버전과 같아서 진행 상황이 그대로 이어집니다.
   ========================================================= */
const LS={nickname:'nickname',completed:'completedCategories',stickers:'earnedStickers',dates:'stickerEarnedDate',progress:'quizProgress'};
const getJSON=(k,def)=>{try{return JSON.parse(localStorage.getItem(k))||def;}catch{return def;}};
const setJSON=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
const getNick=()=>{try{return localStorage.getItem(LS.nickname)||'';}catch{return '';}};

const CHAR=f=>'assets/characters/'+f;
const appRoot=()=>document.getElementById('app')||document.body;

/* PC에서 보이는 폰 상태바 (시간 · 신호 · 배터리) */
(function(){
  const app=document.getElementById('app');if(!app)return;
  const bar=document.createElement('div');bar.className='statusbar';bar.setAttribute('aria-hidden','true');
  bar.innerHTML='<span class="time"></span><span class="island"></span><span class="icons">'+
    '<svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>'+
    '<svg viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.5 6.9l1.4 1.4a4.4 4.4 0 0 1 6.2 0l1.4-1.4a6.4 6.4 0 0 0-9 0zM.7 4.1l1.4 1.4a8.4 8.4 0 0 1 11.8 0l1.4-1.4a10.4 10.4 0 0 0-14.6 0z"/></svg>'+
    '<svg viewBox="0 0 27 12"><rect x=".5" y=".5" width="22" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="16" height="8" rx="2"/><rect x="24" y="4" width="2" height="4" rx="1" opacity=".45"/></svg></span>';
  app.prepend(bar);
  const t=bar.querySelector('.time');
  const tick=()=>{const d=new Date();t.textContent=d.getHours()+':'+String(d.getMinutes()).padStart(2,'0');};
  tick();setInterval(tick,15000);
})();
/* 분야 정의 — 새 스티커 이미지(assets/stickers)를 아이콘으로 사용 */
const FIELDS=[
  {id:'laundry', name:'세탁',      page:'quiz-laundry.html',  sticker:'assets/stickers/sticker-laundry.png',  pose:'laundry_pose 01.png',  summary:'세탁기, 제대로 돌리고 있나요?', tint:'#E6F3FF'},
  {id:'bills',   name:'공과금',    page:'quiz-bills.html',    sticker:'assets/stickers/sticker-bills.png',    pose:'bill_pose 01.png',     summary:'관리비와 공과금, 헷갈리지 않나요?', tint:'#FFF6D9'},
  {id:'trash',   name:'쓰레기 배출',page:'quiz-trash.html',    sticker:'assets/stickers/sticker-trash.png',    pose:'trash_pose 01.png',    summary:'이 쓰레기, 어디에 버려야 할까요?', tint:'#E5F6E3'},
  {id:'repair',  name:'수리 요청',  page:'quiz-repair.html',   sticker:'assets/stickers/sticker-repair.png',   pose:'repair_pose 01.png',   summary:'고장 났을 때 누구에게 먼저 말해야 할까요?', tint:'#E8EEFF'},
  {id:'homecare',name:'집 관리',    page:'quiz-homecare.html', sticker:'assets/stickers/sticker-homecare.png', pose:'homecare_pose 01.png', summary:'환기와 곰팡이 관리, 잘하고 있나요?', tint:'#FFEFE4'}
];
const STICKER_EXTRA={streak:'assets/stickers/sticker-streak.png',medal:'assets/stickers/sticker-medal.png',basket:'assets/stickers/sticker-basket.png'};

/* 페이지 이동: 화면이 살짝 사라진 뒤 로딩 화면으로 */
function goWithLoading(targetPage){
  try{sessionStorage.setItem('nextPage',targetPage);}catch{}
  document.body.classList.add('leaving');
  setTimeout(()=>{location.href='loading.html';},230);
}
function goDirect(page){
  /* 앱 안에서 홈으로 돌아올 때는 시작 화면을 건너뜀 (새로고침하면 다시 나옴) */
  if(/(^|\/)index\.html$/.test(page)){try{sessionStorage.setItem('skipSplash','1');}catch{}}
  document.body.classList.add('leaving');
  setTimeout(()=>{location.href=page;},230);
}

/* 떨어지는 나뭇잎 */
function spawnLeaves(container,count=7){
  if(!container)return;
  const layer=document.createElement('div');layer.className='leaf-layer';
  for(let i=0;i<count;i++){
    const l=document.createElement('span');l.className='leaf';
    l.style.left=(Math.random()*100)+'%';
    const s=.6+Math.random()*.8;l.style.width=(14*s)+'px';l.style.height=(22*s)+'px';
    l.style.animationDuration=(9+Math.random()*9)+'s';
    l.style.animationDelay=(-Math.random()*14)+'s';
    l.style.filter=`hue-rotate(${Math.floor(Math.random()*30-15)}deg)`;
    layer.appendChild(l);
  }
  container.prepend(layer);
}

/* 버튼 물결 효과 */
document.addEventListener('pointerdown',e=>{
  const b=e.target.closest('.btn');if(!b)return;
  const r=b.getBoundingClientRect();const d=Math.max(r.width,r.height);
  const s=document.createElement('span');s.className='ripple';
  s.style.width=s.style.height=d+'px';
  s.style.left=(e.clientX-r.left-d/2)+'px';s.style.top=(e.clientY-r.top-d/2)+'px';
  b.appendChild(s);setTimeout(()=>s.remove(),650);
});

/* 토스트 */
function toast(msg){
  let t=document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';appRoot().appendChild(t);}
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),1800);
}

/* 컨페티 */
function launchConfetti(n=46){
  const colors=['#CBEA53','#8CC63F','#FFDCC2','#FFE15A','#FFFFFF','#B7D848'];
  for(let i=0;i<n;i++){
    const c=document.createElement('div');c.className='confetti';
    c.style.left=Math.random()*100+'vw';
    c.style.background=colors[Math.floor(Math.random()*colors.length)];
    c.style.animationDuration=(2+Math.random()*2)+'s';
    c.style.animationDelay=(Math.random()*1.2)+'s';
    if(Math.random()<.4)c.style.borderRadius='50%';
    appRoot().appendChild(c);setTimeout(()=>c.remove(),4600);
  }
}

/* 하단 탭바 */
const ICONS={
  home:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/></svg>',
  sticker:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.8z"/></svg>',
  guide:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7.5h.01"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>'
};
function renderTabbar(active,onGuide){
  const nav=document.createElement('nav');nav.className='tabbar';nav.setAttribute('aria-label','하단 메뉴');
  const tabs=[['home','홈','index.html'],['sticker','스티커','sticker-room.html'],['guide','안내','']];
  tabs.forEach(([id,label,page])=>{
    const b=document.createElement('button');b.type='button';b.className='tab'+(id===active?' active':'');
    b.innerHTML=ICONS[id]+'<span>'+label+'</span>';
    b.addEventListener('click',()=>{
      if(id==='guide'){ if(onGuide)onGuide(); else {try{sessionStorage.setItem('openGuide','1');}catch{} goWithLoading('index.html');} return; }
      if(id===active)return;
      goWithLoading(page);
    });
    nav.appendChild(b);
  });
  appRoot().appendChild(nav);
}

/* 바텀시트 열고 닫기 */
function openSheet(el){el.classList.add('open');}
function closeSheet(el){el.classList.remove('open');}
document.addEventListener('click',e=>{
  if(e.target.classList&&e.target.classList.contains('sheet-backdrop')&&!e.target.dataset.locked)closeSheet(e.target);
});

/* 뒤로가기(bfcache)로 돌아왔을 때 사라짐 상태 해제 */
window.addEventListener('pageshow',()=>document.body.classList.remove('leaving'));
