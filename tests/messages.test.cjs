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

test('cake popup has no image and page has no cake image reference', () => {
  const a = app();
  const popup = a.run('createPopupContent(travelData.find(p => p.id === "frameri"))');
  assert.doesNotMatch(popup, /<img/);
  assert.doesNotMatch(fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'), /frameri\.jpg/);
  assert.equal(fs.existsSync(path.join(__dirname, '../assets/images/frameri.jpg')), false);
});
