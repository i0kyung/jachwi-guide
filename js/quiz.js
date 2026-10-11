/* =========================================================
   자취 가이드 · 퀴즈 엔진 (5개 분야 공통)
   각 퀴즈 페이지는 CATEGORY 와 QUESTIONS 만 정의하고 이 파일을 불러옵니다.
   채점 규칙(오답 1개까지 통과)과 저장 방식은 기존과 같습니다.
   ========================================================= */
(function(){
const FIELD=FIELDS.find(f=>f.id===CATEGORY.id)||{};
const STICKER=FIELD.sticker||'';
spawnLeaves(document.getElementById('app'),4);
document.getElementById('back-btn').innerHTML=ICONS.back;
document.getElementById('back-btn').addEventListener('click',()=>goWithLoading('index.html'));
document.getElementById('field-name').textContent=(FIELD.name||'')+' 퀴즈';

const IMG=document.getElementById('character-img');
IMG.addEventListener('error',()=>IMG.src='assets/characters/idle.png');
function setChar(state){
  const map={pose:CATEGORY.poseImg,correct:CATEGORY.correctImg,wrong:CATEGORY.wrongImg};
  IMG.className='character-img';
  IMG.src=map[state]||CATEGORY.poseImg||'assets/characters/idle.png';
  void IMG.offsetWidth;
  if(state==='correct')IMG.classList.add('correct-bounce');
  else if(state==='wrong')IMG.classList.add('wrong-drop');
  else IMG.classList.add('fade-up');
}
function shuffleArray(array){
  const copy=[...array];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
}

let idx=0,correctCount=0,wrongCount=0,streak=0,answerLocked=false,hasAnswered=false,currentChoices=[];
const passWrongLimit=1;
const QUIZ=shuffleArray(QUESTIONS);
const $=id=>document.getElementById(id);
const elTitle=$('scene-title'),elText=$('scene-text'),elChoices=$('choices'),elExplain=$('explain'),
      elExplainText=$('explain-text'),elSource=$('source'),elNext=$('next-btn'),elProgress=$('progress'),
      bubble=$('bubble'),card=$('quiz-card'),segs=$('segments'),combo=$('combo');

/* 문제 수만큼 진행 세그먼트 */
QUIZ.forEach(()=>{const s=document.createElement('span');s.className='seg';segs.appendChild(s);});
function paintSegments(){
  [...segs.children].forEach((s,i)=>{s.classList.toggle('now',i===idx);});
}

function render(){
  const q=QUIZ[idx];
  if(!q){finish();return;}
  elProgress.textContent=(idx+1)+' / '+QUIZ.length;
  paintSegments();
  card.classList.remove('card-in');void card.offsetWidth;card.classList.add('card-in');
  $('scene-tag').textContent='상황 '+(idx+1);
  elTitle.textContent=q.sceneTitle;elText.textContent=q.sceneText;
  answerLocked=false;hasAnswered=false;
  elChoices.innerHTML='';elChoices.classList.remove('answered');
  elExplain.className='explain';elExplainText.textContent='';elSource.textContent='';
  elNext.className='btn btn-lime next-btn';
  bubble.className='bubble';
  setChar('pose');
  currentChoices=shuffleArray(q.choices.map((text,i)=>({text,isCorrect:i===q.answerIndex})));
  currentChoices.forEach((choice,i)=>{
    const b=document.createElement('button');
    b.type='button';b.className='choice';
    b.style.animationDelay=(.12+i*.07)+'s';
    b.innerHTML='<span class="key">'+'ABC'[i]+'</span><span class="txt"></span>';
    b.querySelector('.txt').textContent=choice.text;
    b.addEventListener('mouseenter',()=>{if(!answerLocked)IMG.classList.add('hover-pulse');});
    b.addEventListener('mouseleave',()=>{if(!answerLocked)IMG.classList.remove('hover-pulse');});
    b.addEventListener('click',()=>answer(i,b));
    elChoices.appendChild(b);
  });
}

function answer(i,btn){
  if(answerLocked||!currentChoices[i])return;
  answerLocked=true;hasAnswered=true;
  const q=QUIZ[idx];const buttons=elChoices.querySelectorAll('.choice');
  elChoices.classList.add('answered');
  buttons.forEach(b=>{b.disabled=true;});
  currentChoices.forEach((c,k)=>{if(c.isCorrect&&buttons[k])buttons[k].classList.add('correct');});
  btn.classList.add('selected');
  const seg=segs.children[idx];
  if(currentChoices[i].isCorrect){
    correctCount++;streak++;
    setChar('correct');
    bubble.textContent=['참 잘했어요!','정답이에요!','최고예요!'][Math.floor(Math.random()*3)];
    bubble.classList.add('show');
    elExplain.classList.add('show');
    seg.classList.add('ok');
    burst(btn);
    if(streak>=2)showCombo(streak);
  }else{
    wrongCount++;streak=0;
    btn.classList.add('wrong','shake');
    setChar('wrong');
    bubble.textContent='괜찮아요, 같이 알아봐요';bubble.classList.add('show','sad');
    elExplain.classList.add('show','no');
    seg.classList.add('no');
  }
  $('explain-head').textContent=currentChoices[i].isCorrect?'정답 해설':'이렇게 하면 좋아요';
  elExplainText.textContent=q.explanation;elSource.textContent=q.source;
  elNext.textContent=idx+1<QUIZ.length?'다음 문제':'결과 보기';
  elNext.insertAdjacentHTML('beforeend',' <span class="chev">›</span>');
  elNext.classList.add('show');
  setTimeout(()=>elNext.scrollIntoView({behavior:'smooth',block:'nearest'}),250);
}

/* 정답 반짝이 */
function burst(el){
  const app=appRoot();const r=el.getBoundingClientRect();const a0=app.getBoundingClientRect();
  for(let k=0;k<10;k++){
    const s=document.createElement('span');s.className='burst';
    s.style.left=(r.left-a0.left+r.width-34)+'px';s.style.top=(r.top-a0.top+r.height/2)+'px';
    const a=Math.random()*Math.PI*2,d=30+Math.random()*40;
    s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');
    s.style.background=['#CBEA53','#FFE15A','#8CC63F','#FFDCC2'][k%4];
    app.appendChild(s);setTimeout(()=>s.remove(),700);
  }
}
/* 연속 정답 콤보 (불꽃 스티커) */
function showCombo(n){
  combo.querySelector('strong').textContent=n+'연속 정답!';
  combo.classList.remove('show');void combo.offsetWidth;combo.classList.add('show');
}

elNext.addEventListener('click',()=>{
  if(!hasAnswered)return;
  idx++;
  if(idx<QUIZ.length){render();document.querySelector('.app-main').scrollTo({top:0,behavior:'smooth'});}
  else finish();
});

function finish(){
  const isPassed=wrongCount<=passWrongLimit;
  const pop=$('sticker-pop');const box=pop.querySelector('.sticker-card');
  const currentPage=location.pathname.split('/').pop()||(CATEGORY.id?('quiz-'+CATEGORY.id+'.html'):'index.html');
  [...segs.children].forEach(s=>s.classList.remove('now'));
  if(isPassed){
    const completed=getJSON(LS.completed,[]);
    if(!completed.includes(CATEGORY.id)){completed.push(CATEGORY.id);setJSON(LS.completed,completed);}
    const stickers=getJSON(LS.stickers,[]);
    const isNew=!stickers.includes(CATEGORY.id);
    if(isNew){stickers.push(CATEGORY.id);setJSON(LS.stickers,stickers);}
    const dates=getJSON(LS.dates,{});
    if(!dates[CATEGORY.id]){
      const d=new Date();
      dates[CATEGORY.id]=d.getFullYear()+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getDate()).padStart(2,'0');
      setJSON(LS.dates,dates);
    }
    box.innerHTML=
      '<div class="reward"><span class="rays"></span><img class="reward-sticker" src="'+STICKER+'" alt="'+(FIELD.name||'')+' 스티커"></div>'+
      '<div class="sticker-msg">'+(isNew?'새 스티커를 받았어요!':'스티커를 이미 갖고 있어요!')+'</div>'+
      '<div class="score"><span><b>'+correctCount+'</b>정답</span><span><b>'+wrongCount+'</b>오답</span></div>'+
      '<p class="result-note">이번 분야를 잘 이해했어요. 오답 '+wrongCount+'개로 통과했어요.</p>'+
      '<div class="result-actions">'+
        '<button class="btn btn-lime" id="goto-room">스티커 방으로 가기 <span class="chev">›</span></button>'+
        '<button class="btn btn-cream" id="goto-home">메인으로 가기</button>'+
      '</div>';
    pop.classList.add('show');
    setChar('correct');IMG.src='assets/characters/happy.png';
    launchConfetti();
    $('goto-room').addEventListener('click',()=>goWithLoading('sticker-room.html'));
    $('goto-home').addEventListener('click',()=>goWithLoading('index.html'));
  }else{
    box.innerHTML=
      '<img class="result-img" src="assets/characters/sad.png" alt="아쉬워하는 루온" onerror="this.src=\'assets/characters/idle.png\'">'+
      '<div class="sticker-msg">조금만 더 연습하면 받을 수 있어요!</div>'+
      '<div class="score"><span><b>'+correctCount+'</b>정답</span><span><b>'+wrongCount+'</b>오답</span></div>'+
      '<p class="result-note">틀린 문제를 다시 살펴보고 한 번 더 도전해봐요. 오답 '+wrongCount+'개는 스티커 조건을 넘었어요.</p>'+
      '<div class="result-actions">'+
        '<button class="btn btn-peach" id="retry-quiz">다시 도전하기</button>'+
        '<button class="btn btn-cream" id="goto-home">메인으로 가기</button>'+
      '</div>';
    pop.classList.add('show');
    $('retry-quiz').addEventListener('click',()=>goWithLoading(currentPage));
    $('goto-home').addEventListener('click',()=>goWithLoading('index.html'));
  }
}
render();
})();
