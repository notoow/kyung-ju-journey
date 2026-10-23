/* ==========================================================================
   경주 환갑 여행 (Kyungju Journey) - JavaScript Logic
   실제 로컬 사진 파일(assets/images) 연동, 프라메리 케이크 픽업 및 단정 1줄 버튼
   ========================================================================== */

// 1. 전체 여행 명소 & 맛집 실제 데이터셋
const travelData = [
  {
    id: "stay-sirae",
    name: "스테이 시래 (우리의 숙소)",
    category: "stay",
    day: [1, 2, 3],
    lat: 35.770702150544,
    lng: 129.288356243301,
    badge: "경주 시래동 독채 숙소",
    address: "경상북도 경주시 시동로 122",
    shortDesc: "경주시 시동로 122에 위치한 독채 숙소. 실내 수영장과 자쿠지, 사우나를 갖추고 있습니다.",
    image: "assets/images/stay_sirae.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/경주시 시동로 122",
    naverUrl: "https://map.naver.com/v5/search/경주시 시동로 122"
  },
  // --- [식당 1: 첫날 점심 수리뫼] ---
  {
    id: "surimoe",
    phone: "054-748-2507",
    name: "수리뫼",
    category: "food",
    day: [1],
    lat: 35.752233800363,
    lng: 129.208015533727,
    badge: "👑 1일차 환갑 첫 점심",
    price: "궁중 코스 / 홍게순두부 정식",
    address: "경상북도 경주시 내남면 포석로 110-32",
    shortDesc: "경주시 내남면의 한정식 식당입니다. 코스요리와 정식 메뉴를 운영하며, 사진은 이 식당에서 제공한 코스 음식입니다.",
    image: "assets/images/surimoe_main.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/경주 수리뫼",
    naverUrl: "https://map.naver.com/v5/search/경주 수리뫼"
  },
  // --- [스페셜: 1일차 15:00 픽업 프라메리] ---
  {
    id: "frameri",
    phone: "010-9597-6987",
    name: "프라메리 (환갑 케이크 픽업)",
    category: "food",
    day: [1],
    lat: 35.837864370941,
    lng: 129.205167363028,
    badge: "10/24 15:00 픽업 예정",
    address: "경북 경주시 금성로233번길 20 (사정동 65-81)",
    shortDesc: "10월 24일 오후 3시 픽업 예정입니다. 주소는 경주시 금성로233번길 20입니다.",
    image: null,
    kakaoUrl: "https://place.map.kakao.com/780633253",
    naverUrl: "https://map.naver.com/v5/search/경주 프라메리"
  },
  // --- [식당 2: 첫날 저녁 부부수산 대게·모듬회 포장] ---
  {
    id: "bubususan",
    phone: "0507-1301-7418",
    name: "부부수산 (감포 회센터)",
    category: "food",
    day: [1],
    lat: 35.808282622978,
    lng: 129.507623142334,
    badge: "🦀 1일차 숙소 만찬 포장",
    price: "대게 찜 & 모듬회 세트 시가",
    address: "경상북도 경주시 감포읍 감포항구길 91 (수협활어직판장 1층 11번)",
    shortDesc: "감포 수협활어직판장 1층 11번 매장입니다. 모둠회, 해산물, 대게를 취급하며 포장할 수 있습니다.",
    image: "assets/images/bubususan_main.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/감포항 부부수산",
    naverUrl: "https://map.naver.com/v5/search/감포항 부부수산"
  },
  // --- [관광지 1: 첨성대] ---
  {
    id: "cheomseongdae",
    name: "첨성대",
    category: "tour",
    day: [1],
    lat: 35.8347,
    lng: 129.2190,
    badge: "국보 제31호 · 랜드마크",
    address: "경상북도 경주시 인왕동 839-1",
    shortDesc: "신라 시대에 세워진 천문 관측 시설입니다. 경주 동부사적지 일대에서 함께 둘러볼 수 있습니다.",
    image: "assets/images/cheomseongdae.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/경주 첨성대",
    naverUrl: "https://map.naver.com/v5/search/경주 첨성대"
  },
  // --- [관광지 2: 불국사] ---
  {
    id: "bulguksa",
    name: "불국사",
    category: "tour",
    day: [2],
    lat: 35.7901,
    lng: 129.3320,
    badge: "유네스코 세계유산",
    address: "경상북도 경주시 불국로 385",
    shortDesc: "토함산 기슭의 신라 사찰로, 석굴암과 함께 유네스코 세계유산에 등재되어 있습니다. 다보탑과 석가탑, 청운교·백운교가 있습니다.",
    image: "assets/images/bulguksa.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/불국사",
    naverUrl: "https://map.naver.com/v5/search/불국사"
  },
  // --- [관광지 3: 동궁과 월지] ---
  {
    id: "donggung",
    name: "동궁과 월지 (안압지)",
    category: "tour",
    day: [1],
    lat: 35.8341,
    lng: 129.2266,
    badge: "경주 최고의 야경",
    address: "경상북도 경주시 원화로 102",
    shortDesc: "신라 왕궁의 별궁 터와 연못입니다. 월지 주변의 복원 건물과 야간 경관을 볼 수 있습니다.",
    image: "assets/images/donggung.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/동궁과월지",
    naverUrl: "https://map.naver.com/v5/search/동궁과월지"
  },
  // --- [관광지 4: 대릉원 & 천마총] ---
  {
    id: "daereungwon",
    name: "대릉원 & 천마총",
    category: "tour",
    day: [1],
    lat: 35.8385,
    lng: 129.2144,
    badge: "신라 거대 고분군",
    address: "경상북도 경주시 황남동 31-1",
    shortDesc: "신라 시대 고분이 모여 있는 유적입니다. 고분 사이 산책로와 천마총을 둘러볼 수 있습니다.",
    image: "assets/images/daereungwon.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/경주 대릉원",
    naverUrl: "https://map.naver.com/v5/search/경주 대릉원"
  },
  // --- [관광지 5: 보문관광단지] ---
  {
    id: "bomun",
    name: "보문관광단지 (보문호)",
    category: "tour",
    day: [2],
    lat: 35.8450,
    lng: 129.2880,
    badge: "호반 드라이브 & 산책",
    address: "경상북도 경주시 보문로 424-33 일원",
    shortDesc: "보문호를 중심으로 조성된 관광단지입니다. 호반 산책로를 따라 호수 풍경을 즐길 수 있습니다.",
    image: "assets/images/bomun.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/보문관광단지",
    naverUrl: "https://map.naver.com/v5/search/보문관광단지"
  },
  // --- [관광지 6: 경주타워] ---
  {
    id: "gyeongjutower",
    name: "경주타워 (엑스포대공원)",
    category: "tour",
    day: [2],
    lat: 35.8345,
    lng: 129.2905,
    badge: "82m 황룡사 목탑 음각화",
    address: "경상북도 경주시 경감로 614",
    shortDesc: "경주엑스포대공원 안에 있는 높이 82m 전망 타워입니다. 황룡사 구층목탑의 형태를 비워낸 건축물입니다.",
    image: "assets/images/gyeongjutower.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/경주타워",
    naverUrl: "https://map.naver.com/v5/search/경주타워"
  },
  // --- [관광지 7: 경주월드] ---
  {
    id: "gyeongjuworld",
    name: "경주월드",
    category: "tour",
    day: [2],
    lat: 35.8398,
    lng: 129.2828,
    badge: "스릴 & 패밀리 테마파크",
    address: "경상북도 경주시 보문로 544",
    shortDesc: "보문관광단지에 있는 테마파크입니다. 드라켄과 파에톤 등 놀이시설을 운영합니다.",
    image: "assets/images/gyeongjuworld.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/경주월드",
    naverUrl: "https://map.naver.com/v5/search/경주월드"
  },
  // --- [관광지 8: 황리단길] ---
  {
    id: "hwangridan",
    name: "황리단길",
    category: "tour",
    day: [2],
    lat: 35.8373,
    lng: 129.2096,
    badge: "트렌디 감성 한옥거리",
    address: "경상북도 경주시 황남동 포석로 일대",
    shortDesc: "황남동과 사정동의 포석로 일대 거리입니다. 한옥을 활용한 카페, 식당, 상점들이 모여 있습니다.",
    image: "assets/images/hwangridan.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/황리단길",
    naverUrl: "https://map.naver.com/v5/search/황리단길"
  },
  // --- [식당 3: 향화정] ---
  {
    id: "hyanghwajeong",
    phone: "0507-1359-8765",
    name: "향화정",
    category: "food",
    day: [2],
    lat: 35.8368,
    lng: 129.2090,
    badge: "황리단길 한옥 한식당",
    address: "경상북도 경주시 사정로57번길 17",
    shortDesc: "황리단길 인근 한식당입니다. 꼬막무침비빔밥, 육회물회, 육회비빔밥, 해물파전 등을 판매합니다.",
    image: "assets/images/hyanghwajeong_main.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/황남동 향화정",
    naverUrl: "https://map.naver.com/v5/search/황남동 향화정"
  },
  // --- [식당 4: 함양집] ---
  {
    id: "hamyangjip",
    phone: "054-777-6947",
    name: "함양집 (보문점)",
    category: "food",
    day: [2],
    lat: 35.8576,
    lng: 129.2731,
    badge: "4대 90년 전통 명가",
    address: "경상북도 경주시 북군1길 10-1",
    shortDesc: "경주시 북군1길에 있는 한식당입니다. 한우물회와 비빔밥을 맛볼 수 있습니다.",
    image: "assets/images/hamyangjip_main.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/경주 함양집",
    naverUrl: "https://map.naver.com/v5/search/경주 함양집"
  },
  // --- [식당 5: 경주원조콩국] ---
  {
    id: "kongguk",
    phone: "054-743-9644",
    name: "경주원조콩국",
    category: "food",
    day: [3],
    lat: 35.8335,
    lng: 129.2155,
    badge: "경주 고유 향토 미식",
    address: "경상북도 경주시 첨성로 113",
    shortDesc: "경주시 첨성로의 콩국 전문점입니다. 따뜻한 콩국과 해물파전 등을 판매합니다.",
    image: "assets/images/kongguk_main.jpg?v=20261022",
    kakaoUrl: "https://map.kakao.com/link/search/경주원조콩국",
    naverUrl: "https://map.naver.com/v5/search/경주원조콩국"
  }
];

if (typeof extraPlaces !== "undefined") travelData.push(...extraPlaces);
travelData.find(p => p.id === "hamyangjip").day = [];

let map = null;
let markers = [];
let routeLines = [];

function initMap() {
  const mapElement = document.getElementById("gyeongju-map");
  if (!mapElement || typeof L === "undefined") return;

  map = L.map("gyeongju-map", {
    center: [35.825, 129.27],
    zoom: 12,
    zoomControl: true,
    scrollWheelZoom: false
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  renderQuickList();
  updateMapMarkers("all");
}

function createCustomMarkerIcon(item) {
  let bgColor = "#0284c7"; // tour
  let iconHtml = "🏛️";

  if (item.category === "stay") {
    bgColor = "#d97706";
    iconHtml = "🏡";
  } else if (item.category === "food") {
    bgColor = "#dc2626";
    iconHtml = "🍱";
  }

  const html = `
    <div style="
      background-color: ${bgColor};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
      transition: transform 0.2s;
    ">
      ${iconHtml}
    </div>
  `;

  return L.divIcon({
    html: html,
    className: "custom-map-pin",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
}

function createPopupContent(item) {
  const badgeClass = item.category === "stay" ? "icon-stay" : item.category === "tour" ? "icon-tour" : "icon-food";
  
  return `
    <div class="map-popup-card">
      ${item.image ? `<img src="${item.image}" alt="${item.name}" class="map-popup-img" />` : ""}
      <div class="map-popup-body">
        <span class="map-popup-badge ${badgeClass}">${item.badge}</span>
        <h4 class="map-popup-title">${item.name}</h4>
        <div class="map-popup-address">📍 ${item.address}</div>
        <p style="font-size: 0.82rem; color: #555; margin-bottom: 10px; line-height: 1.4;">${item.shortDesc}</p>
        ${item.phone ? `<a class="source-link phone-link" href="tel:${item.phone.replaceAll('-','')}">전화 ${item.phone}</a>` : ""}
        <div class="map-popup-actions">
          <a href="${item.kakaoUrl}" target="_blank" rel="noopener noreferrer" class="btn-popup-link btn-kakao">
            카카오맵
          </a>
          <a href="${item.naverUrl}" target="_blank" rel="noopener noreferrer" class="btn-popup-link btn-naver">
            네이버지도
          </a>
        </div>
      </div>
    </div>
  `;
}

function updateMapMarkers(filterType) {
  if (!map) return;

  markers.forEach(m => map.removeLayer(m));
  markers = [];
  routeLines.forEach(l => map.removeLayer(l));
  routeLines = [];

  let filteredPlaces = [];

  if (filterType === "all") {
    filteredPlaces = travelData;
  } else if (filterType === "stay" || filterType === "tour" || filterType === "food") {
    filteredPlaces = travelData.filter(p => p.category === filterType);
  } else if (filterType === "day1") {
    // 1일차 동선: 수리뫼(점심) -> 대릉원/첨성대 -> 프라메리(15:00 케이크 픽업) -> 부부수산(대게포장) -> 스테이 시래(체크인/파티) -> 동궁과 월지(야경)
    const order = ["surimoe", "daereungwon", "cheomseongdae", "frameri", "stay-sirae", "songdaemal", "bubususan", "stay-sirae", "woljeonggyo"];
    filteredPlaces = order.map(id => travelData.find(p => p.id === id)).filter(Boolean);
  } else if (filterType === "day2") {
    // 2일차 동선: 스테이 시래 -> 불국사 -> 함양집 -> 보문단지/경주타워 -> 황리단길
    const order = ["stay-sirae", "bulguksa", "bokgil", "bomun", "gyeongjutower", "hwangridan"];
    filteredPlaces = order.map(id => travelData.find(p => p.id === id)).filter(Boolean);
  }

  const latLngs = [];
  filteredPlaces.filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lng)).forEach(item => {
    const icon = createCustomMarkerIcon(item);
    const marker = L.marker([item.lat, item.lng], { icon: icon, title: item.name, alt: item.name }).addTo(map);
    marker.bindPopup(createPopupContent(item));
    marker.bindTooltip(item.name);
    marker.placeId = item.id;
    markers.push(marker);
    latLngs.push([item.lat, item.lng]);
  });

  if ((filterType === "day1" || filterType === "day2") && latLngs.length > 1) {
    const polyline = L.polyline(latLngs, {
      color: filterType === "day1" ? "#dc2626" : "#0284c7",
      weight: 4,
      dashArray: "8, 8",
      opacity: 0.85
    }).addTo(map);
    routeLines.push(polyline);
  }

  if (latLngs.length > 0) {
    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }
}

function renderQuickList() {
  const container = document.getElementById("map-quick-grid");
  if (!container) return;

  container.innerHTML = travelData.map(item => {
    const iconClass = item.category === "stay" ? "icon-stay" : item.category === "tour" ? "icon-tour" : "icon-food";
    const iconChar = item.category === "stay" ? "🏡" : item.category === "tour" ? "🏛️" : "🍱";
    return `
      <button type="button" class="map-quick-item" onclick="focusOnMapItem('${item.id}')">
        <div class="map-quick-icon ${iconClass}">${iconChar}</div>
        <div class="map-quick-info">
          <div class="map-quick-name">${({frameri: "프라메리", hwangnyongsa: "황룡사지·역사문화관"})[item.id] || item.name}</div>
          <div class="map-quick-sub">${item.badge}</div>
        </div>
      </button>
    `;
  }).join("");
}

window.focusOnMapItem = function(placeId) {
  const target = travelData.find(p => p.id === placeId);
  if (!target || !map) return;
  if (!Number.isFinite(target.lat) || !Number.isFinite(target.lng)) { window.open(target.kakaoUrl, "_blank", "noopener"); return; }

  const mapSection = document.getElementById("map");
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: "smooth" });
  }

  updateMapMarkers("all");
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === "all");
  });

  setTimeout(() => {
    map.flyTo([target.lat, target.lng], 15, { duration: 1.2 });
    const marker = markers.find(m => m.placeId === placeId);
    if (marker) {
      marker.openPopup();
    }
  }, 400);
};

function updateCountdown() {
  const targetDate = new Date("2026-10-24T00:00:00+09:00").getTime();
  const now = new Date().getTime();
  const distance = targetDate - now;

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");
  const cdTitle = document.getElementById("countdown-status-title");

  if (!daysEl) return;

  if (distance < 0) {
    const pastDays = Math.floor(Math.abs(distance) / (1000 * 60 * 60 * 24));
    if (pastDays <= 2) {
      if (cdTitle) cdTitle.innerText = "🎂 오늘은 아빠 환갑 축하 여행 중입니다! 🎉";
      daysEl.innerText = "D";
      hoursEl.innerText = "A";
      minutesEl.innerText = "Y";
      secondsEl.innerText = "❤️";
    } else {
      if (cdTitle) cdTitle.innerText = "행복했던 경주 환갑 여행의 추억 🌸";
      daysEl.innerText = "00";
      hoursEl.innerText = "00";
      minutesEl.innerText = "00";
      secondsEl.innerText = "00";
    }
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.innerText = String(days).padStart(2, "0");
  hoursEl.innerText = String(hours).padStart(2, "0");
  minutesEl.innerText = String(minutes).padStart(2, "0");
  secondsEl.innerText = String(seconds).padStart(2, "0");
}

window.triggerCelebration = function() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.6 },
      colors: ["#d4af37", "#9d3a2e", "#f27059", "#3a6351", "#ffffff"]
    });

    setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.7 },
        colors: ["#d4af37", "#f59e0b", "#9d3a2e"]
      });
      confetti({
        particleCount: 90,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.7 },
        colors: ["#d4af37", "#f59e0b", "#9d3a2e"]
      });
    }, 250);
  }
  showToast("🎊 아버님의 60번째 환갑을 온 가족이 축하드립니다! 🎂");
};

window.copyToClipboard = function(text, label = "주소") {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 ${label}가 클립보드에 복사되었습니다!`);
    }).catch(() => {
      fallbackCopy(text, label);
    });
  } else {
    fallbackCopy(text, label);
  }
};

function fallbackCopy(text, label) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  showToast(`📋 ${label}가 복사되었습니다!`);
}

window.shareWebsite = function() {
  const shareData = {
    title: "아빠 박재성 님의 환갑 경주 여행 웹사이트",
    text: "10월 24일~26일 온 가족이 함께하는 경주 환갑 여행 일정과 장소 안내입니다 🌸",
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    copyToClipboard(window.location.href, "웹사이트 링크");
  }
};

function showToast(msg) {
  let toast = document.getElementById("toast-notice");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notice";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  // Keep basic controls usable even when the external map library fails.
  setTimeout(() => { try { initMap(); } catch (error) { console.error("지도 초기화 실패", error); } }, 0);

  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateMapMarkers(btn.dataset.filter);
    });
  });

  const tabBtns = document.querySelectorAll(".timeline-tab-btn");
  const tabPanes = document.querySelectorAll(".timeline-content-pane");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetDay = btn.dataset.day;
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const targetPane = document.getElementById(`timeline-${targetDay}`);
      if (targetPane) targetPane.classList.add("active");
      tabBtns.forEach(b => b.setAttribute("aria-selected", String(b === btn)));
    });
  });

  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle("open");
      mobileToggle.innerHTML = isOpen ? "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m6 6 12 12M18 6 6 18\"/></svg>" : "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 6h16M4 12h16M4 18h16\"/></svg>";
    });

    const navLinks = navMenu.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (navMenu.classList.contains("open")) {
          navMenu.classList.remove("open");
          mobileToggle.innerHTML = "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 6h16M4 12h16M4 18h16\"/></svg>";
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove("open");
        mobileToggle.innerHTML = "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 6h16M4 12h16M4 18h16\"/></svg>";
      }
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
