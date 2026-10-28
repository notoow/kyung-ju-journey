// Retire only this site's old browser message storage. No data is uploaded.
(() => {
  for (const key of ['kyungju_journey_messages', 'kyungju_journey_messages_v2']) {
    try { localStorage.removeItem(key); } catch { /* Storage may be blocked. */ }
  }
})();
