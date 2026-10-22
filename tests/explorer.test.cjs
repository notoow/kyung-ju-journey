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
  vm.runInContext(read('app.js'),ctx); ready();
  for (const index of [1,2,0]) {
    tabs[index].listeners.click();
    assert.deepEqual(panes.map(p=>p.classList.contains('active')),[0,1,2].map(i=>i===index));
    assert.equal(tabs[index].attrs['aria-selected'],'true');
  }
});

test('all added places have photos, navigation links and resolved map coordinates',()=>{
  const ctx=vm.createContext({document:{addEventListener(){}},window:{}});
  vm.runInContext(read('places-extra.js'),ctx);
  const places=vm.runInContext('extraPlaces',ctx);
  const credits=JSON.parse(read('assets/image-sources.json'));
  assert.equal(places.filter(p=>p.category==='tour').length,17);
  assert.equal(places.filter(p=>p.category==='food').length,13);
  for(const p of places){
    assert.ok(Number.isFinite(p.lat)&&Number.isFinite(p.lng),p.name);
    assert.ok(p.lat>35.6&&p.lat<36.1&&p.lng>129&&p.lng<129.6,p.name);
    assert.ok(fs.existsSync(path.join(root,p.image)),p.name);
    assert.ok(credits[p.id]?.sourcePage,p.name);
    assert.ok(p.kakaoUrl.startsWith('https://map.kakao.com/'));
    assert.ok(p.naverUrl.startsWith('https://map.naver.com/'));
  }
});

test('forecast rejects missing dates and null values without interpreting them as zero',()=>{
  const ctx=vm.createContext({document:{addEventListener(){}}});
  vm.runInContext(read('explore.js'),ctx);vm.runInContext(read('explore-ui.js'),ctx);
  assert.equal(vm.runInContext('validForecast(weatherSnapshot)',ctx),true);
  assert.equal(vm.runInContext('validForecast({daily:{}})',ctx),false);
  assert.equal(vm.runInContext('validForecast({...weatherSnapshot,daily:{...weatherSnapshot.daily,temperature_2m_min:[null,17,18]}})',ctx),false);
  assert.equal(vm.runInContext('minuteOfDay("2026-10-24T17:36")',ctx),1056);
});
