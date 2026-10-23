// Keep rapid taps responsive while serializing small groups of server writes.
export function createApplauseQueue({send, change, saved, failed, delay=900, batchSize=60, minGap=600}) {
  let pending=0, sending=0, timer=null, version=0, nextSaveAt=0;
  const snapshot=()=>({pending:pending+sending,version});
  const notify=()=>change(snapshot());
  function schedule() {
    if(pending&&!sending&&timer===null)timer=setTimeout(flush,delay);
  }
  async function flush() {
    if(sending||!pending)return;
    if(timer!==null){clearTimeout(timer);timer=null;}
    if(Date.now()<nextSaveAt){timer=setTimeout(flush,nextSaveAt-Date.now());return;}
    sending=Math.min(pending,batchSize); pending-=sending;
    const amount=sending;
    try {
      const result=await send(amount);
      sending=0; nextSaveAt=Date.now()+minGap; version++; saved(result,amount);
    } catch(error) {
      // Failed optimistic taps must not remain displayed as saved applause.
      const rejected=amount+pending;
      pending=0; sending=0; version++; failed(error,rejected);
    }
    notify(); schedule();
  }
  return {
    add(){pending++;version++;notify();schedule();},
    flush,
    snapshot
  };
}
