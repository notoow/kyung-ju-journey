// All cards share the same place data as the overview map.
function extraCard(p) {
  const credit = imageCredits[p.id];
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
  document.getElementById('extra-tours').innerHTML = extraPlaces.filter(p => p.category === 'tour').map(extraCard).join('');
  document.getElementById('extra-foods').innerHTML = extraPlaces.filter(p => p.category === 'food').map(extraCard).join('');
  const foodTypes = ['한식·솥밥','빵·간식','회·해산물','회·해산물','한식·솥밥','국밥·면·탕'];
  const tourTypes = ['시내·문화','불국사·토함산','시내·야경','시내·문화','보문·휴식','보문·휴식','보문·휴식','시내·문화'];
  for (const [section, category, labels, prefix] of [['dining','food',foodTypes,'food'],['attractions','tour',tourTypes,'tour']]) {
    const originals = travelData.filter(p => p.category === category && !extraPlaces.includes(p));
    document.querySelectorAll(`#${section} .places-grid:not(#extra-${category === 'food' ? 'foods' : 'tours'}) .place-card`).forEach((card,i) => {
      card.dataset.placeId = originals[i]?.id;
      card.dataset.group = labels[i] || '기타';
      const phone = originals[i]?.phone;
      if (phone && !card.querySelector('a[href^="tel:"]')) {
        card.querySelector('.place-map-links-row').insertAdjacentHTML('beforebegin',
          `<a class="source-link phone-link" href="tel:${phone.replaceAll('-','')}">전화 문의 ${phone}</a>`);
      }
    });
    const cards = [...document.querySelectorAll(`#${section} .place-card`)];
    cards.forEach(card => {
      const p = extraPlaces.find(p => p.id === card.dataset.placeId);
      if (p) card.dataset.group = p.foodType || p.region;
    });
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

let weatherData = weatherSnapshot;
let weatherDay = 0;
let weatherLive = false;
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
function validForecast(data) {
  return data?.daily && ['2026-10-24','2026-10-25','2026-10-26'].every((day,i) =>
    data.daily.time?.[i] === day && ['sunrise','sunset'].every(k => /^2026-10-\d{2}T\d{2}:\d{2}$/.test(data.daily[k]?.[i])) &&
    ['temperature_2m_min','temperature_2m_max','precipitation_probability_max','weather_code'].every(k => Number.isFinite(data.daily[k]?.[i])));
}
function renderWeather() {
  const d = weatherData.daily, i = weatherDay;
  const rise = d.sunrise[i].slice(11,16), set = d.sunset[i].slice(11,16);
  const left = minuteOfDay(d.sunrise[i]) / 14.4, right = minuteOfDay(d.sunset[i]) / 14.4;
  document.getElementById('weather-days').innerHTML = d.time.map((date,j) => `<button type="button" class="weather-day ${j === i ? 'active' : ''}" aria-pressed="${j === i}" data-day="${j}"><strong>10/${24+j} ${['토','일','월'][j]}</strong><span>${describeWeather(d.weather_code[j])}</span><span>${d.temperature_2m_min[j]}° / ${d.temperature_2m_max[j]}°</span></button>`).join('');
  document.getElementById('sun-panel').innerHTML = `<div class="sun-summary"><div>일출<strong>${rise}</strong></div><div class="sun-middle">경주 · 한국시간<span>강수 확률 ${d.precipitation_probability_max[i]}%</span></div><div>일몰<strong>${set}</strong></div></div><div class="sun-strip" role="img" aria-label="${d.time[i]} 일출 ${rise}, 일몰 ${set}. 밝은 구간은 낮, 어두운 구간은 밤입니다."><span class="sun-daylight" style="left:${left}%;width:${right-left}%"></span><span class="sun-marker" style="left:${left}%">☀</span><span class="sun-marker" style="left:${right}%">☾</span></div><div class="sun-hours"><span>00시</span><span>06시</span><span>12시</span><span>18시</span><span>24시</span></div><p class="sun-tip">밝은 구간은 낮, 어두운 구간은 밤입니다. ${i === 0 ? '20시 월정교 방문은 일몰 이후입니다.' : '해가 지면 야경 코스로 전환하세요.'} 산과 구름에 따라 실제로 해가 보이는 시간은 달라집니다.</p>`;
  const fetched = new Date(weatherData.fetchedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});
  document.getElementById('weather-status').textContent = `${weatherLive ? '최신 조회' : '저장된 예보'} · ${fetched} 기준 · 경주 시내 기준 예보`;
}
async function refreshWeather() {
  const btn = document.getElementById('weather-refresh'); btn.disabled = true;
  const status = document.getElementById('weather-status'); status.textContent = '최신 예보를 확인하고 있어요…';
  const controller = new AbortController(), timeout = setTimeout(() => controller.abort(),8000);
  try {
    const response = await fetch(weatherSnapshot.sourceUrl,{signal:controller.signal});
    if (!response.ok) throw new Error('forecast unavailable');
    const data = await response.json(); if (!validForecast(data)) throw new Error('invalid forecast');
    weatherData = {...data,fetchedAt:new Date().toISOString()}; weatherLive = true; renderWeather();
  } catch { renderWeather(); status.textContent += ' · 새 예보를 가져오지 못했습니다'; }
  finally { clearTimeout(timeout); btn.disabled = false; }
}
document.addEventListener('DOMContentLoaded', () => {
  initExplorer();
  renderWeather();
  document.getElementById('weather-days').addEventListener('click', e => {
    const b = e.target.closest('[data-day]'); if (!b) return;
    weatherDay = Number(b.dataset.day); renderWeather();
  });
  document.getElementById('weather-refresh').addEventListener('click',refreshWeather);
  refreshWeather();
});
