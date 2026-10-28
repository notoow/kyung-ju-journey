// All cards share the same place data as the overview map.
function extraCard(p) {
  const credit = p.photoSource ? {sourcePage:p.photoSource, sourceLabel:'사진 출처 ↗'} : null;
  return `<article class="place-card" data-place-id="${p.id}">
    ${p.image ? `<div class="place-img-wrap"><img class="place-img" src="${p.image}" alt="${p.name} 실제 사진" loading="lazy"></div>` : ''}
    <div class="place-body"><span class="explore-tag">${p.badge}</span><h3 class="place-title">${p.name}</h3>
    <p class="place-address">${p.address}</p>
    ${p.menu ? `<p class="menu-highlight">${p.menu}</p>` : ''}
    <p class="place-desc">${p.shortDesc}</p>
    ${p.priceNote ? `<p class="photo-credit">${p.priceNote}</p>` : ''}
    ${credit ? `<p class="photo-credit">사진: <a href="${credit.sourcePage}" target="_blank" rel="noopener noreferrer">${credit.sourceLabel}</a></p>` : ''}
    ${p.sourceUrl ? `<a class="source-link" href="${p.sourceUrl}" target="_blank" rel="noopener noreferrer">매장·메뉴 정보 ↗</a>` : ''}
    ${p.reservationUrl ? `<a class="booking-link" href="${p.reservationUrl}" target="_blank" rel="noopener noreferrer">테이블링 줄서기 ↗</a>` : ''}
    ${p.phone ? `<a class="source-link phone-link" href="tel:${p.phone.replaceAll('-','')}">전화 문의 ${p.phone}</a>` : ''}
    <div class="place-map-links-row"><a class="btn-map btn-kakao" href="${p.kakaoUrl}" target="_blank" rel="noopener noreferrer">카카오맵</a><a class="btn-map btn-naver" href="${p.naverUrl}" target="_blank" rel="noopener noreferrer">네이버지도</a></div>
    ${Number.isFinite(p.lat) ? `<button class="place-locate" type="button" onclick="focusOnMapItem('${p.id}')">통합 지도에서 보기</button>` : ''}
    </div></article>`;
}

function initExplorer() {
  for (const [section, category, prefix] of [['dining','food','food'],['attractions','tour','tour']]) {
    const places = extraPlaces.filter(p => p.category === category);
    const grid = document.getElementById(`extra-${category === 'food' ? 'foods' : 'tours'}`);
    grid.innerHTML = places.map(extraCard).join('');
    const cards = [...grid.children];
    cards.forEach((card,i) => card.dataset.group = places[i].foodType || places[i].region);
    const groups = ['전체',...new Set(cards.map(c => c.dataset.group))];
    const filters = document.getElementById(`${prefix}-filters`);
    filters.innerHTML = groups.map((g,i) => `<button type="button" class="browse-chip ${i === 0 ? 'active' : ''}" aria-pressed="${i === 0}" data-group="${g}">${g}</button>`).join('');
    const count = document.getElementById(`${prefix}-count`);
    count.textContent = `${cards.length}곳`;
    filters.addEventListener('click', e => {
      const button = e.target.closest('button'); if (!button) return;
      filters.querySelectorAll('button').forEach(b => { b.classList.toggle('active',b === button); b.setAttribute('aria-pressed',String(b === button)); });
      cards.forEach(c => { c.hidden = button.dataset.group !== '전체' && c.dataset.group !== button.dataset.group; });
      count.textContent = `${cards.filter(c => !c.hidden).length}곳`;
    });
  }
  document.querySelector('[data-filter="all"]').textContent = `전체 ${travelData.length}곳`;
  document.querySelector('[data-filter="tour"]').textContent = `관광 ${travelData.filter(p => p.category === 'tour').length}곳`;
}

// Mobile disclosures keep long lists compact without removing any places.
function initMobileDisclosures() {
  function disclosure(host, nodes, label, id, card = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mobile-disclosure-toggle';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', id);
    const title = document.createElement('span');
    title.textContent = label;
    const state = document.createElement('span');
    state.className = 'disclosure-state';
    state.textContent = '펼치기 +';
    button.append(title, state);
    const panel = document.createElement('div');
    panel.id = id;
    panel.className = 'mobile-disclosure-panel';
    nodes.forEach(node => panel.append(node));
    host.classList.add('mobile-disclosure');
    if (card) host.classList.add('mobile-place-disclosure');
    host.append(button, panel);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      host.classList.toggle('disclosure-open', open);
      state.textContent = open ? '접기 −' : '펼치기 +';
    });
  }
  for (const [id, label] of [['attractions','관광지 목록'],['dining','음식점 목록']]) {
    const container = document.querySelector(`#${id} > .container`);
    const head = container.querySelector('.section-head');
    const nodes = [...container.children].filter(node => node !== head);
    // Filters and descriptions belong to the same collapsible section.
    const title = head.querySelector('.section-title');
    const extra = [];
    for (let node = title.nextElementSibling; node; node = node.nextElementSibling) extra.push(node);
    disclosure(container, [...extra, ...nodes], label, `${id}-mobile-panel`);
  }
  document.querySelectorAll('#attractions .place-card, #dining .place-card').forEach(card => {
    const shortNames = {hwangnyongsa: '황룡사지·역사문화관', bubususan: '부부수산', gyeongjutower: '경주타워', seokgatap: '석가탑'};
    disclosure(card, [...card.children], shortNames[card.dataset.placeId] || card.querySelector('.place-title').textContent.trim(),
      `place-${card.dataset.placeId}-panel`, true);
  });
  const quick = document.getElementById('map-quick-grid');
  const host = document.createElement('div');
  quick.before(host);
  disclosure(host, [quick], '장소 빠른 이동', 'map-quick-panel');
}

let weatherData = null;
let weatherDay = 0;
let weatherLive = false;
let weatherLoading = false;
function forecastDates(now = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
  return [0,1,2].map(offset => new Date(Date.parse(today+'T00:00:00+09:00') + offset*86400000 + 9*3600000).toISOString().slice(0,10));
}
function describeWeather(code) {
  if (code === 0) return '☀️ 맑음';
  if ([1,2,3].includes(code)) return '⛅ 구름';
  if ([45,48].includes(code)) return '🌫️ 안개';
  if ([71,73,75,77,85,86].includes(code)) return '❄️ 눈';
  if ([95,96,99].includes(code)) return '⛈️ 뇌우';
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return '🌧️ 비';
  return '날씨 정보 없음';
}
function minuteOfDay(iso) {
  const [h,m] = iso.slice(11,16).split(':').map(Number); return h * 60 + m;
}
function validForecast(data, now = new Date()) {
  const dates = forecastDates(now);
  return data?.daily && data.daily.time?.length === 3 && data.daily.time.every((day,i) =>
    day === dates[i] && ['sunrise','sunset'].every(k => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(data.daily[k]?.[i]) && data.daily[k][i].startsWith(day)) &&
    ['temperature_2m_min','temperature_2m_max','precipitation_probability_max','weather_code'].every(k => Number.isFinite(data.daily[k]?.[i])));
}
function renderWeather() {
  if (weatherData && !validForecast(weatherData)) weatherData = null;
  if (!weatherData) {
    document.getElementById('weather-days').innerHTML = forecastDates().map((date,j) => `<div class="weather-day"><strong>${['오늘','내일','모레'][j]} · ${date.slice(5).replace('-','/')}</strong><span>예보 확인 중</span></div>`).join('');
    document.getElementById('sun-panel').innerHTML = '<p class="sun-tip">경주의 날씨와 일출·일몰을 자동으로 불러옵니다.</p>';
    document.getElementById('weather-status').textContent = '최신 예보를 확인하고 있어요…'; return;
  }
  const d = weatherData.daily, i = weatherDay;
  const rise = d.sunrise[i].slice(11,16), set = d.sunset[i].slice(11,16);
  const left = minuteOfDay(d.sunrise[i]) / 14.4, right = minuteOfDay(d.sunset[i]) / 14.4;
  document.getElementById('weather-days').innerHTML = d.time.map((date,j) => `<button type="button" class="weather-day ${j === i ? 'active' : ''}" aria-pressed="${j === i}" data-day="${j}"><strong>${['오늘','내일','모레'][j]} · ${date.slice(5).replace('-','/')}</strong><span>${describeWeather(d.weather_code[j])}</span><span>${d.temperature_2m_min[j]}° / ${d.temperature_2m_max[j]}°</span></button>`).join('');
  document.getElementById('sun-panel').innerHTML = `<div class="sun-summary"><div>일출<strong>${rise}</strong></div><div class="sun-middle">경주 · 한국시간<span>강수 확률 ${d.precipitation_probability_max[i]}%</span></div><div>일몰<strong>${set}</strong></div></div><div class="sun-strip" role="img" aria-label="${d.time[i]} 일출 ${rise}, 일몰 ${set}. 밝은 구간은 낮, 어두운 구간은 밤입니다."><span class="sun-daylight" style="left:${left}%;width:${right-left}%"></span><span class="sun-marker" style="left:${left}%">☀</span><span class="sun-marker" style="left:${right}%">☾</span></div><div class="sun-hours"><span>00시</span><span>06시</span><span>12시</span><span>18시</span><span>24시</span></div><p class="sun-tip">밝은 구간은 낮, 어두운 구간은 밤입니다. 해가 지면 야경 코스로 전환하세요. 산과 구름에 따라 실제로 해가 보이는 시간은 달라집니다.</p>`;
  const fetched = new Date(weatherData.fetchedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});
  document.getElementById('weather-status').textContent = `${weatherLive ? '최신 조회' : '저장된 예보'} · ${fetched} 기준 · 경주 시내 기준 예보`;
}
async function refreshWeather() {
  if (weatherLoading) return;
  weatherLoading = true;
  renderWeather();
  const btn = document.getElementById('weather-refresh'); btn.disabled = true;
  const status = document.getElementById('weather-status'); status.textContent = '최신 예보를 확인하고 있어요…';
  const controller = new AbortController(), timeout = setTimeout(() => controller.abort(),8000);
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.8562&longitude=129.2247&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=Asia%2FSeoul&forecast_days=3',{signal:controller.signal});
    if (!response.ok) throw new Error('forecast unavailable');
    const data = await response.json(); if (!validForecast(data)) throw new Error('invalid forecast');
    weatherData = {...data,fetchedAt:new Date().toISOString()}; weatherLive = true; renderWeather();
  } catch {
    weatherLive = false; renderWeather();
    if (!weatherData) {
      document.querySelectorAll('#weather-days .weather-day span').forEach(span => span.textContent = '예보 연결 안 됨');
      document.getElementById('sun-panel').textContent = '인터넷 연결을 확인한 뒤 새로고침해 주세요.';
      status.textContent = '예보를 가져오지 못했습니다. 잠시 후 자동으로 다시 확인합니다.';
    } else status.textContent += ' · 새 예보를 가져오지 못했습니다';
  }
  finally { clearTimeout(timeout); btn.disabled = false; weatherLoading = false; }
}
document.addEventListener('DOMContentLoaded', () => {
  initExplorer();
  initMobileDisclosures();
  renderWeather();
  document.getElementById('weather-days').addEventListener('click', e => {
    const b = e.target.closest('[data-day]'); if (!b) return;
    weatherDay = Number(b.dataset.day); renderWeather();
  });
  document.getElementById('weather-refresh').addEventListener('click',refreshWeather);
  refreshWeather();
  setInterval(() => { if (!document.hidden) refreshWeather(); }, 15 * 60 * 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshWeather(); });
  window.addEventListener('online', refreshWeather);
});
