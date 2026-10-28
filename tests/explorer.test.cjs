const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');

function node(day, active = false) {
  const classes = new Set(active ? ['active'] : []);
  return { dataset:{day}, attrs:{}, listeners:{},
    classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c)},
    addEventListener(name,fn){this.listeners[name]=fn;},
    setAttribute(k,v){this.attrs[k]=v;}
  };
}
test('all three itinerary tabs work when map library is unavailable', () => {
  const tabs = ['1','2','3'].map((d,i)=>node(d,i===0));
  const panes = ['1','2','3'].map((d,i)=>node(d,i===0));
  let ready;
  const ctx = vm.createContext({window:{},console,setTimeout:fn=>fn(),setInterval(){},localStorage:{removeItem(){},getItem(){return null;}},
    document:{addEventListener:(event,fn)=>{if(event==='DOMContentLoaded')ready=fn;},
      querySelectorAll:selector=>selector==='.timeline-tab-btn'?tabs:selector==='.timeline-content-pane'?panes:[],
      getElementById:id=>id.startsWith('timeline-')?panes[Number(id.slice(-1))-1]:null}});
  vm.runInContext(read('places-extra.js'),ctx); vm.runInContext(read('app.js'),ctx); ready();
  for (const index of [1,2,0]) {
    tabs[index].listeners.click();
    assert.deepEqual(panes.map(p=>p.classList.contains('active')),[0,1,2].map(i=>i===index));
    assert.equal(tabs[index].attrs['aria-selected'],'true');
  }
});

test('public places retain coordinates and navigation but no bundled photos or personal days',()=>{
 const ctx=vm.createContext({});vm.runInContext(read('places-extra.js'),ctx);
 const places=vm.runInContext('extraPlaces',ctx); assert.equal(places.length,44);
 for(const p of places){ assert.ok(Number.isFinite(p.lat)&&Number.isFinite(p.lng));assert.equal(p.image,null);assert.equal(p.day.length,0);assert.ok(p.kakaoUrl.startsWith('https://'));assert.ok(p.naverUrl.startsWith('https://')); }
});
test('public page has no account or message integrations',()=>{
 const html=read('index.html');assert.doesNotMatch(html,/community\.js|firebase|message-form|family-name|countdown-box/);
 assert.ok(fs.existsSync(path.join(root,'LICENSE')));
});
test('forecast requires three complete daily entries',()=>{
 const ctx=vm.createContext({document:{addEventListener(){}}});vm.runInContext(read('explore-ui.js'),ctx);
 assert.equal(vm.runInContext('Boolean(validForecast({daily:{time:[]}}))',ctx),false);
 assert.equal(vm.runInContext('Boolean(validForecast({daily:{time:["2030-01-01","2030-01-02","2030-01-03"]}}))',ctx),false);
});
