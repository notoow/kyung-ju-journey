const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

function app(initial = {}, blocked = false) {
  const store = new Map(Object.entries(initial));
  const grid = { innerHTML: '' };
  const ctx = vm.createContext({
    window: {},
    document: { addEventListener() {}, getElementById: id => id === 'messages-grid' ? grid : null },
    localStorage: {
      getItem(k) { if (blocked) throw Error('blocked'); return store.get(k) ?? null; },
      removeItem(k) { if (blocked) throw Error('blocked'); store.delete(k); },
      setItem(k, v) { if (blocked) throw Error('blocked'); store.set(k, v); }
    }
  });
  vm.runInContext(source, ctx);
  return { run: code => vm.runInContext(code, ctx), grid, store };
}

test('legacy messages are removed and never reseeded', () => {
  const a = app({ kyungju_journey_messages: JSON.stringify([{ id: 'msg-1', content: 'old' }]) });
  a.run('loadMessages()');
  assert.equal(a.store.has('kyungju_journey_messages'), false);
  assert.match(a.grid.innerHTML, /아직 작성된 메시지가 없습니다/);
  a.run('loadMessages()');
  assert.match(a.grid.innerHTML, /아직 작성된 메시지가 없습니다/);
});

test('new user messages survive reload and are escaped', () => {
  const a = app({ kyungju_journey_messages_v2: JSON.stringify([{ author: '<script>', content: '<img>', date: '<b>' }]) });
  a.run('loadMessages()');
  assert.match(a.grid.innerHTML, /&lt;script&gt;/);
  assert.match(a.grid.innerHTML, /&lt;img&gt;/);
  assert.match(a.grid.innerHTML, /&lt;b&gt;/);
});

test('malformed or unavailable storage does not break rendering', () => {
  for (const value of ['{', 'null', '{}', '[null, 42]']) {
    const a = app({ kyungju_journey_messages_v2: value });
    assert.doesNotThrow(() => a.run('loadMessages()'));
    assert.match(a.grid.innerHTML, /아직 작성된 메시지가 없습니다/);
  }
  assert.doesNotThrow(() => app({}, true).run('loadMessages()'));
});

test('cake popup has no image and page has no cake image reference', () => {
  const a = app();
  const popup = a.run('createPopupContent(travelData.find(p => p.id === "frameri"))');
  assert.doesNotMatch(popup, /<img/);
  assert.doesNotMatch(fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'), /frameri\.jpg/);
  assert.equal(fs.existsSync(path.join(__dirname, '../assets/images/frameri.jpg')), false);
});
