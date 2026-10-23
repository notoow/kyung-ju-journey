import { communityConfig as config } from './community-config.js';
import { createApplauseQueue } from './applause-queue.mjs';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import { initializeAuth, browserLocalPersistence, inMemoryPersistence, signInAnonymously,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import { getFirestore, doc, collection, getDoc, getDocs, getCountFromServer, getAggregateFromServer, sum, query, orderBy,
  limit, startAfter, runTransaction, serverTimestamp, deleteDoc } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
import { initializeAppCheck, getToken, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app-check.js';

const app = initializeApp(config.firebase);
const writerApp = initializeApp(config.firebase, 'message-writer');
if (!config.appCheckSiteKey) throw new Error('Community verification is not configured.');
const appChecks = [app, writerApp].map(instance =>
  initializeAppCheck(instance, {provider:new ReCaptchaEnterpriseProvider(config.appCheckSiteKey), isTokenAutoRefreshEnabled:true}));
const auth = initializeAuth(app, {persistence:[browserLocalPersistence, inMemoryPersistence]});
const writerAuth = initializeAuth(writerApp, {persistence:inMemoryPersistence});
const db = getFirestore(app);
const writerDb = getFirestore(writerApp);
const root = `sites/${config.siteId}`;
const el = id => document.getElementById(id);
const status = el('community-status');
const form = el('message-form');
const grid = el('messages-grid');
const more = el('messages-more');
const cheer = el('community-like');
const dialog = el('delete-message-dialog');
const deleteForm = el('delete-message-form');
let cursor, records = [], busy = false, selected, active = false;
let myCheers = 0, totalCheers = 0, cheerError = '', bounce;
const cheerStatus = el('applause-status');
const applauseQueue=createApplauseQueue({
  send:saveCheers,
  change:()=>renderCheers(),
  saved:(count)=>{myCheers=count;cheerError='';},
  failed:(error,rejected)=>{
    totalCheers-=rejected;
    cheerError='축하를 저장하지 못했어요. 연결을 확인하고 다시 눌러 주세요.';
    console.warn('Applause save failed:',error.code||error.message);
  }
});
const messageEmail = authKey => `${authKey}.${config.siteId}@guest.invalid`;

// Unique public salt prevents credential reuse across messages. The digest is sent
// only to Firebase Auth; it is never published as an offline PIN verifier.
// A short PIN still has only 4-6 digits of entropy. This does NOT make it a strong password.
async function credential(pin, authKey) {
  if (!/^\d{4,6}$/.test(pin)) throw new Error('숫자 4~6자리 비밀번호를 입력해 주세요.');
  const bytes = new TextEncoder().encode(`mini-sites-v1:${config.siteId}:${authKey}:${pin}`);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), n=>n.toString(16).padStart(2,'0')).join('');
}
function say(text, error=false) { status.textContent=text; status.classList.toggle('is-error',error); }
function readableError(e) {
  if (['auth/invalid-credential','auth/wrong-password','auth/user-not-found'].includes(e.code)) return '비밀번호가 일치하지 않습니다.';
  if (e.code==='auth/too-many-requests') return '반복 시도가 제한되었습니다. 잠시 후 다시 시도해 주세요.';
  if (e.code==='permission-denied') return '등록 간격이나 이용 한도에 도달했거나 요청을 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.';
  if (e.code==='unavailable'||e.code==='auth/network-request-failed') return '연결을 확인한 뒤 다시 시도해 주세요.';
  return e.code ? '요청을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.' : e.message;
}
function textNode(tag, className, text) {
  const node=document.createElement(tag); node.className=className; node.textContent=text; return node;
}
function render() {
  grid.replaceChildren();
  if (!records.length) grid.append(textNode('p','messages-empty','아직 작성된 메시지가 없습니다. 첫 축하 메시지를 남겨주세요.'));
  for (const item of records) {
    const card=textNode('article','rolling-card','');
    card.append(textNode('div','rolling-card-tape',''),textNode('div','rolling-card-text',item.content));
    const footer=textNode('div','rolling-card-footer','');
    footer.append(textNode('span','rolling-card-author',item.author),textNode('span','',item.createdAt?.toDate().toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'})||''));
    const remove=textNode('button','message-delete','삭제'); remove.type='button';
    remove.setAttribute('aria-label',`${item.author} 님의 글 삭제`);
    remove.addEventListener('click',()=>{
      if(busy)return; selected=item; deleteForm.reset(); el('delete-error').textContent='';
      dialog.showModal(); el('delete-pin').focus();
    });
    footer.append(remove); card.append(footer); grid.append(card);
  }
}
async function load(append=false) {
  const parts=[orderBy('createdAt','desc'),limit(30)];
  if(append&&cursor)parts.push(startAfter(cursor));
  const snap=await getDocs(query(collection(db,`${root}/messages`),...parts));
  const items=snap.docs.map(d=>({id:d.id,...d.data()}));
  records=append?[...records,...items.filter(x=>!records.some(y=>y.id===x.id))]:items;
  cursor=snap.docs.at(-1); more.hidden=snap.size<30; render();
}
async function refreshLike() {
  const before=applauseQueue.snapshot();
  if(before.pending)return;
  const reactions=collection(db,`${root}/reactions`);
  // Keep every original one-click reaction; missing "extra" fields contribute zero.
  const [count, extra]=await Promise.all([getCountFromServer(reactions),getAggregateFromServer(reactions,{total:sum('extra')})]);
  await auth.authStateReady();
  const mine=auth.currentUser?await getDoc(doc(db,`${root}/reactions/${auth.currentUser.uid}`)):null;
  // A refresh started before a tap must not overwrite its optimistic count.
  if(before.version!==applauseQueue.snapshot().version)return;
  myCheers=mine?.exists()?1+(mine.data().extra||0):0;
  totalCheers=count.data().count+(extra.data().total||0);
  renderCheers();
}
function renderCheers() {
  const waiting=applauseQueue.snapshot().pending;
  el('community-like-count').textContent=totalCheers.toLocaleString('ko-KR');
  cheer.setAttribute('aria-label',`축하해요, 모두 ${totalCheers}번의 축하`);
  cheer.classList.toggle('has-cheered',myCheers+waiting>0);
  cheerStatus.textContent=cheerError||(waiting?'축하를 보내는 중… 계속 눌러도 좋아요!':myCheers?`내가 보낸 축하 ${myCheers.toLocaleString('ko-KR')}번 · 마음껏 눌러주세요!`:'축하하는 마음만큼 마음껏 눌러주세요!');
}
function cheerBurst() {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced)return;
  const layer=el('applause-particles');
  while(layer.childElementCount>24)layer.firstElementChild.remove();
  const labels=['+1',['🎉','축하!','💛'][Math.floor(Math.random()*3)]];
  labels.forEach((label,i)=>{
    const particle=textNode('span','applause-particle',label);
    particle.style.setProperty('--drift',`${(Math.random()-.5)*160}px`);
    particle.style.setProperty('--rise',`${-100-Math.random()*90}px`);
    particle.style.setProperty('--turn',`${(Math.random()-.5)*38}deg`);
    particle.style.animationDelay=`${i*25}ms`;
    layer.append(particle);
    particle.addEventListener('animationend',()=>particle.remove(),{once:true});
    setTimeout(()=>particle.remove(),2000);
  });
  bounce?.cancel();
  bounce=cheer.animate([{transform:'translateY(3px) scale(.96)'},{transform:'translateY(-1px) scale(1.02)'},{transform:'none'}],{duration:140});
}
function lock(value) {
  busy=value;
  form.querySelector('button[type=submit]').disabled=value||!active;
  deleteForm.querySelector('button[type=submit]').disabled=value;
}
form.addEventListener('submit',async event=>{
  event.preventDefault(); if(busy||!active||!form.reportValidity())return;
  const author=el('msg-author').value.trim(),content=el('msg-content').value.trim(),pin=el('msg-pin').value;
  if(!author||!content)return say('작성자와 메시지를 입력해 주세요.',true);
  lock(true); say('축하 메시지를 등록하고 있습니다…');
  let user, committed=false;
  try {
    const authKey=crypto.randomUUID();
    const password=await credential(pin,authKey);
    ({user}=await createUserWithEmailAndPassword(writerAuth,messageEmail(authKey),password));
    await runTransaction(writerDb,async tx=>{
      const rateRef=doc(writerDb,`${root}/limits/messages`),snap=await tx.get(rateRef),old=snap.data();
      const now=Date.now(), reset=!old||now-old.windowStart.toMillis()>=86400000;
      if(old&&now-old.lastAt.toMillis()<10000)throw new Error('방금 새 글이 등록되었습니다. 10초 후 다시 남겨주세요.');
      if(!reset&&old.count>=100)throw new Error('오늘 등록 가능한 메시지 수에 도달했습니다. 내일 다시 남겨주세요.');
      tx.set(doc(writerDb,`${root}/messages/${user.uid}`),{author,content,authKey,createdAt:serverTimestamp()});
      tx.set(rateRef,{lastUid:user.uid,lastAt:serverTimestamp(),windowStart:reset?serverTimestamp():old.windowStart,count:reset?1:old.count+1});
    });
    committed=true; el('msg-content').value=''; el('msg-pin').value='';
    say('축하 메시지가 등록되었습니다. 삭제할 때 정한 비밀번호를 사용해 주세요.');
    try { await load(); } catch { say('등록은 완료됐습니다. 목록을 보려면 새로고침을 눌러 주세요.'); }
  } catch(e) {
    say(readableError(e),true);
    // Keep input on failure. An unsuccessful post must not leave an unused auth account.
    if(user&&!committed)try { await deleteUser(user); } catch { /* Auth console can remove orphan accounts. */ }
  } finally { await signOut(writerAuth).catch(()=>{}); lock(false); }
});
deleteForm.addEventListener('submit',async event=>{
  event.preventDefault(); if(busy||!selected||!deleteForm.reportValidity())return;
  lock(true); el('delete-error').textContent='비밀번호 확인 중…';
  try {
    const password=await credential(el('delete-pin').value,selected.authKey);
    const {user}=await signInWithEmailAndPassword(writerAuth,messageEmail(selected.authKey),password);
    if(user.uid!==selected.id)throw new Error('이 글의 비밀번호가 아닙니다.');
    await deleteDoc(doc(writerDb,`${root}/messages/${selected.id}`));
    records=records.filter(x=>x.id!==selected.id); render();
    await deleteUser(user).catch(()=>{});
    dialog.close(); deleteForm.reset(); say('메시지가 삭제되었습니다.');
  } catch(e) { el('delete-error').textContent=readableError(e); }
  finally { await signOut(writerAuth).catch(()=>{}); lock(false); }
});
el('delete-cancel').addEventListener('click',()=>{if(!busy){dialog.close();deleteForm.reset();}});
dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();else deleteForm.reset();});
cheer.addEventListener('click',()=>{
  if(cheer.disabled||!active)return;
  cheerError=''; totalCheers++;
  applauseQueue.add();
  cheerBurst();
});
async function saveCheers(amount) {
    await auth.authStateReady();
    const user=auth.currentUser||(await signInAnonymously(auth)).user;
    const ref=doc(db,`${root}/reactions/${user.uid}`);
    return runTransaction(db,async tx=>{
      const snap=await tx.get(ref);
      if(!snap.exists()){
        tx.set(ref,{createdAt:serverTimestamp(),extra:amount-1,lastAt:serverTimestamp()});
        return amount;
      }
      const extra=snap.data().extra||0;
      tx.update(ref,{extra:extra+amount,lastAt:serverTimestamp()});
      return extra+amount+1;
    });
}
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden')applauseQueue.flush();
});
more.addEventListener('click',async()=>{more.disabled=true;try{await load(true);}catch(e){say(readableError(e),true);}finally{more.disabled=false;}});
el('messages-refresh').addEventListener('click',async event=>{
  const button=event.currentTarget; button.disabled=true;
  try{await initialize();}catch(e){say(readableError(e),true);}finally{button.disabled=false;}
});
async function initialize() {
  await getToken(appChecks[0]);
  const site=await getDoc(doc(db,root));
  if(!site.exists()||site.data().enabled!==true)throw new Error('메시지 기능을 준비하고 있습니다. 잠시 후 다시 방문해 주세요.');
  active=true; await Promise.all([load(),refreshLike()]); lock(false); cheer.disabled=false;
  say('모든 방문자가 함께 보는 축하글입니다. 연락처 등 개인정보는 적지 말아 주세요.');
}
initialize().catch(e=>{console.warn('Community initialization failed:',e.code||e.message);say(readableError(e),true);cheerStatus.textContent='연결을 확인한 뒤 페이지를 새로고침해 주세요.';});
