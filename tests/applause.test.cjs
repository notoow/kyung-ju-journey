const {test}=require('node:test');
const assert=require('node:assert/strict');

test('rapid taps beyond ten are immediate and combine into one save',async()=>{
  const {createApplauseQueue}=await import('../applause-queue.mjs');
  const writes=[],states=[];
  const queue=createApplauseQueue({send:async n=>{writes.push(n);return n;},change:s=>states.push(s.pending),saved:()=>{},failed:()=>{}});
  for(let i=0;i<40;i++)queue.add();
  assert.equal(states.at(-1),40);
  assert.deepEqual(writes,[]);
  await queue.flush();
  assert.deepEqual(writes,[40]);
  assert.equal(queue.snapshot().pending,0);
});

test('taps during a slow save remain queued; large bursts split without dropping taps',async()=>{
  const {createApplauseQueue}=await import('../applause-queue.mjs');
  let finish;
  const writes=[];
  const queue=createApplauseQueue({minGap:0,send:n=>{writes.push(n);return new Promise(r=>finish=r);},change:()=>{},saved:()=>{},failed:()=>{}});
  for(let i=0;i<70;i++)queue.add();
  const first=queue.flush();
  for(let i=0;i<8;i++)queue.add();
  await queue.flush();
  assert.deepEqual(writes,[60]);
  assert.equal(queue.snapshot().pending,78);
  finish(60);await first;
  assert.equal(queue.snapshot().pending,18);
  const second=queue.flush();finish(78);await second;
  assert.deepEqual(writes,[60,18]);
  assert.equal(queue.snapshot().pending,0);
});

test('a rejected save rolls back optimistic taps and subsequent taps can save',async()=>{
  const {createApplauseQueue}=await import('../applause-queue.mjs');
  let reject,rolledBack=0,attempts=0,committed=0;
  const queue=createApplauseQueue({send:n=>++attempts===1?new Promise((_,r)=>reject=r):Promise.resolve(n),change:()=>{},saved:n=>committed+=n,failed:(_,n)=>rolledBack+=n});
  queue.add();queue.add();const saving=queue.flush();queue.add();
  reject(new Error('offline'));await saving;
  assert.equal(rolledBack,3);
  assert.equal(queue.snapshot().pending,0);
  queue.add();assert.equal(queue.snapshot().pending,1);
  await queue.flush();
  assert.equal(rolledBack,3);
  assert.equal(committed,1);
  assert.equal(queue.snapshot().pending,0);
});
