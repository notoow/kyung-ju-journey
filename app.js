/* ==========================================================================
   경주 환갑 여행 (Kyungju Journey) - JavaScript Logic
   Pretendard 폰트 및 확장된 8개 관광지 / 5개 맛집 연동
   ========================================================================== */

// 1. 전체 여행 명소 & 맛집 풀 데이터셋 (관광지 8곳 + 맛집 5곳 + 숙소)
const travelData = [
  {
    id: "stay-sirae",
    name: "스테이 시래 (우리의 숙소)",
    category: "stay",
    day: [1, 2, 3],
    lat: 35.7808,
    lng: 129.3082,
    badge: "가족 감성 독채 한옥",
    rating: "5.0",
    address: "경상북도 경주시 시동로 122",
    shortDesc: "불국사 인근의 고즈넉한 감성 독채 한옥. 환갑 축하 파티와 첫날 부부수산 대게·모듬회 만찬을 즐길 최고의 베이스캠프.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    kakaoUrl: "https://map.kakao.com/link/search/경주시 시동로 122",
    naverUrl: "https://map.naver.com/v5/search/경주시 시동로 122"
  },
  // --- [식당 1: 첫날 점심 수리뫼] ---
  {
    id: "surimoe",
    name: "수리뫼 (수뢰뫼)",
    category: "food",
    day: [1],
    lat: 35.7895,
    lng: 129.1985,
    badge: "👑 1일차 환갑 첫 점심",
    rating: "4.8",
    price: "궁중 코스 / 홍게순두부 정식",
    address: "경상북도 경주시 내남면 포석로 110-32",
    shortDesc: "조선왕조 궁중음식 기능이수자 명인이 선보이는 기품 있는 전통 한정식. 정갈한 찬과 깊은 맛으로 아버님 환갑 첫 식사로 제격.",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80",
    kakaoUrl: "https://map.kakao.com/link/search/경주 수리뫼",
    naverUrl: "https://map.naver.com/v5/search/경주 수리뫼"
  },
  // --- [식당 2: 첫날 저녁 부부수산 대게·모듬회 포장] ---
  {
    id: "bubususan",
    name: "부부수산 (감포 회센터)",
    category: "food",
    day: [1],
    lat: 35.8015,
    lng: 129.5050,
    badge: "🦀 1일차 숙소 만찬 포장",
    rating: "4.7",
    price: "대게 찜 & 모듬회 세트 시가",
    address: "경상북도 경주시 감포읍 감포항구길 91 (수협활어직판장 1층 11번)",
    shortDesc: "감포항 직판장의 싱싱한 활어 모듬회와 살이 꽉 찬 대게 찜 포장 전문. 최고 컨디션의 숙소 '스테이 시래'에서 프라이빗 환갑 파티 만찬!",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
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
    rating: "4.7",
    address: "경상북도 경주시 인왕동 839-1",
    shortDesc: "동양에서 가장 오래된 신라의 천문 관측대. 주변의 드넓은 잔디 정원과 꽃밭이 어우러진 경주의 상징적 힐링 산책 명소.",
    image: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80",
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
    rating: "4.6",
    address: "경상북도 경주시 불국로 385",
    shortDesc: "다보탑, 석가탑, 청운교·백운교 등 찬란한 신라 불교 예술의 최고봉. 숙소 스테이 시래에서 차로 5분 거리의 필수 명소.",
    image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
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
    rating: "4.5",
    address: "경상북도 경주시 원화로 102",
    shortDesc: "신라 왕궁의 별궁 터. 밤이 되면 은은한 조명과 연못 물결에 비치는 누각 반영이 환상적인 절경을 연출합니다.",
    image: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80",
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
    rating: "4.5",
    address: "경상북도 경주시 황남동 31-1",
    shortDesc: "푸른 잔디 능선 사이로 이어진 고즈넉한 산책로와 목련 포토존, 내부 관람이 가능한 천마총이 자리한 역사 정원.",
    image: "https://images.unsplash.com/photo-1583083527882-4bee9aba2eea?auto=format&fit=crop&w=800&q=80",
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
    rating: "4.5",
    address: "경상북도 경주시 보문로 424-33 일원",
    shortDesc: "넓게 펼쳐진 잔잔한 보문호수를 따라 걷는 호반 산책로와 드라이브 코스, 오리배 선착장과 감성 카페들이 밀집한 대표 관광지구.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
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
    rating: "4.5",
    address: "경상북도 경주시 경감로 614",
    shortDesc: "황룡사 9층 목탑 실루엣을 음각으로 투각한 높이 82m의 현대적 랜드마크. 보문단지 전경을 한눈에 내려다보는 전망대.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
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
    rating: "4.5",
    address: "경상북도 경주시 보문로 544",
    shortDesc: "국내 최고 롤러코스터 드라켄과 파에톤, 가족 모두가 즐길 수 있는 이국적인 어트랙션과 포토존이 가득한 테마파크.",
    image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=800&q=80",
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
    rating: "4.2",
    address: "경상북도 경주시 황남동 포석로 일대",
    shortDesc: "전통 한옥을 개조한 감성 카페, 아기자기한 소품샵, 길거리 주전부리와 가족 인생네컷을 즐길 수 있는 거리.",
    image: "https://images.unsplash.com/photo-1538669715315-155098f0fb1d?auto=format&fit=crop&w=800&q=80",
    kakaoUrl: "https://map.kakao.com/link/search/황리단길",
    naverUrl: "https://map.naver.com/v5/search/황리단길"
  },
  // --- [식당 3: 향화정] ---
  {
    id: "hyanghwajeong",
    name: "향화정",
    category: "food",
    day: [2],
    lat: 35.8368,
    lng: 129.2090,
    badge: "황리단길 한옥 한식당",
    rating: "4.2",
    price: "1~2만원대",
    address: "경상북도 경주시 사정로57번길 17",
    shortDesc: "고소한 꼬막무침비빔밥과 새콤한 한우 육회물회, 두툼한 해물파전으로 소문난 정갈한 한옥 식당.",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80",
    kakaoUrl: "https://map.kakao.com/link/search/황남동 향화정",
    naverUrl: "https://map.naver.com/v5/search/황남동 향화정"
  },
  // --- [식당 4: 함양집] ---
  {
    id: "hamyangjip",
    name: "함양집 (보문점)",
    category: "food",
    day: [2],
    lat: 35.8576,
    lng: 129.2731,
    badge: "4대 90년 전통 명가",
    rating: "4.0",
    price: "1~2만원대",
    address: "경상북도 경주시 북군1길 10-1",
    shortDesc: "살얼음 동동 뜬 시원한 한우물회와 전통 육회비빔밥, 부드러운 치즈불고기가 일품인 보문단지 명소.",
    image: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=800&q=80",
    kakaoUrl: "https://map.kakao.com/link/search/경주 함양집",
    naverUrl: "https://map.naver.com/v5/search/경주 함양집"
  },
  // --- [식당 5: 경주원조콩국] ---
  {
    id: "kongguk",
    name: "경주원조콩국",
    category: "food",
    day: [3],
    lat: 35.8335,
    lng: 129.2155,
    badge: "경주 고유 향토 미식",
    rating: "4.3",
    price: "1만원대",
    address: "경상북도 경주시 첨성로 113",
    shortDesc: "따끈하고 고소한 콩국에 찹쌀도너츠, 들깨를 띄워 속을 편안하게 풀어주는 3일차 아침 브런치 명소.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    kakaoUrl: "https://map.kakao.com/link/search/경주원조콩국",
    naverUrl: "https://map.naver.com/v5/search/경주원조콩국"
  }
];

// 초기 축하 롤링페이퍼 메시지
const defaultMessages = [
  {
    id: "msg-1",
    author: "사랑하는 아내 화영 🌸",
    content: "여보, 60번째 생신이자 환갑을 온 마음으로 축하해요.\n언제나 가족들을 위해 헌신해줘서 고맙고, 앞으로의 새로운 인생 2막도 지금처럼 건강하고 행복하게 우리 함께 걸어가요. 사랑합니다!",
    date: "2026.10.24"
  },
  {
    id: "msg-2",
    author: "딸 정은 (예비신부) 👰",
    content: "아빠, 언제나 세상에서 가장 든든한 내 편이 되어줘서 고마워요.\n결혼을 앞두고 이렇게 온 가족이 아빠의 환갑을 기념하며 경주에 오니 가슴이 뭉클해요. 오늘 저녁 숙소에서 대게 파티 신나게 해요! 사랑하는 아빠 축하드려요 ❤️",
    date: "2026.10.24"
  },
  {
    id: "msg-3",
    author: "예비사위 우탄 🤵",
    content: "아버님, 뜻깊은 환갑을 진심으로 축하드립니다!\n항상 따뜻하게 품어주시고 맞아주셔서 감사드립니다. 정은이와 함께 평생 효도하며 행복하게 잘 살겠습니다. 오늘 경주에서 최고로 멋진 하루 보내세요!",
    date: "2026.10.24"
  },
  {
    id: "msg-4",
    author: "아들 정훈 🌟",
    content: "아버지, 인생 60부터입니다! 환갑 축하드려요.\n아버지께서 보여주신 성실함과 깊은 사랑을 마음에 새기며 멋지게 자라겠습니다. 이번 2박 3일 경주 여행 맛있는 거 많이 드시고 푹 쉬세요!",
    date: "2026.10.24"
  }
];

// 2. 지도 관련 전역 변수
let map = null;
let markers = [];
let routeLines = [];

// 3. 지도 초기화 함수
function initMap() {
  const mapElement = document.getElementById("gyeongju-map");
  if (!mapElement) return;

  // 경주 중심 좌표 (대릉원과 보문단지, 불국사 전체를 조망)
  map = L.map("gyeongju-map", {
    center: [35.825, 129.27],
    zoom: 12,
    zoomControl: true,
    scrollWheelZoom: false
  });

  // OpenStreetMap 타일 레이어
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // 퀵 리스트 렌더링
  renderQuickList();

  // 모든 마커 렌더링
  updateMapMarkers("all");
}

// 4. 커스텀 마커 아이콘 생성
function createCustomMarkerIcon(item) {
  let bgColor = "#0284c7"; // tour (청록 파랑)
  let iconHtml = "🏛️";

  if (item.category === "stay") {
    bgColor = "#d97706"; // 숙소 (골드 오렌지)
    iconHtml = "🏡";
  } else if (item.category === "food") {
    bgColor = "#dc2626"; // 맛집 (레드)
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

// 5. 팝업 HTML 생성 (클릭 시 카카오맵/네이버 지도 원클릭 열기)
function createPopupContent(item) {
  const badgeClass = item.category === "stay" ? "icon-stay" : item.category === "tour" ? "icon-tour" : "icon-food";
  
  return `
    <div class="map-popup-card">
      <img src="${item.image}" alt="${item.name}" class="map-popup-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80';" />
      <div class="map-popup-body">
        <span class="map-popup-badge ${badgeClass}">${item.badge}</span>
        <h4 class="map-popup-title">${item.name}</h4>
        <div class="map-popup-address">📍 ${item.address}</div>
        <p style="font-size: 0.82rem; color: #555; margin-bottom: 10px; line-height: 1.4;">${item.shortDesc}</p>
        <div class="map-popup-actions">
          <a href="${item.kakaoUrl}" target="_blank" rel="noopener noreferrer" class="btn-popup-link btn-kakao">
            🟡 카카오맵 바로 열기
          </a>
          <a href="${item.naverUrl}" target="_blank" rel="noopener noreferrer" class="btn-popup-link btn-naver">
            🟢 네이버 지도 열기
          </a>
        </div>
      </div>
    </div>
  `;
}

// 6. 마커 필터 업데이트
function updateMapMarkers(filterType) {
  if (!map) return;

  // 기존 마커 및 경로 라인 제거
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
    // 1일차 동선: 수리뫼(점심) -> 대릉원/첨성대 -> 부부수산(대게포장) -> 스테이 시래(파티) -> 동궁과 월지(야경)
    const order = ["surimoe", "daereungwon", "cheomseongdae", "bubususan", "stay-sirae", "donggung"];
    filteredPlaces = order.map(id => travelData.find(p => p.id === id)).filter(Boolean);
  } else if (filterType === "day2") {
    // 2일차 동선: 스테이 시래 -> 불국사 -> 함양집 -> 보문단지/경주타워 -> 황리단길
    const order = ["stay-sirae", "bulguksa", "hamyangjip", "bomun", "gyeongjutower", "hwangridan"];
    filteredPlaces = order.map(id => travelData.find(p => p.id === id)).filter(Boolean);
  }

  // 마커 추가
  const latLngs = [];
  filteredPlaces.forEach(item => {
    const icon = createCustomMarkerIcon(item);
    const marker = L.marker([item.lat, item.lng], { icon: icon }).addTo(map);
    marker.bindPopup(createPopupContent(item));
    marker.placeId = item.id;
    markers.push(marker);
    latLngs.push([item.lat, item.lng]);
  });

  // 동선인 경우 폴리라인 그리기
  if ((filterType === "day1" || filterType === "day2") && latLngs.length > 1) {
    const polyline = L.polyline(latLngs, {
      color: filterType === "day1" ? "#dc2626" : "#0284c7",
      weight: 4,
      dashArray: "8, 8",
      opacity: 0.85
    }).addTo(map);
    routeLines.push(polyline);
  }

  // 지도 영역 자동 맞춤
  if (latLngs.length > 0) {
    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }
}

// 7. 지도 하단 퀵 링크 목록 렌더링
function renderQuickList() {
  const container = document.getElementById("map-quick-grid");
  if (!container) return;

  container.innerHTML = travelData.map(item => {
    const iconClass = item.category === "stay" ? "icon-stay" : item.category === "tour" ? "icon-tour" : "icon-food";
    const iconChar = item.category === "stay" ? "🏡" : item.category === "tour" ? "🏛️" : "🍱";
    return `
      <div class="map-quick-item" onclick="focusOnMapItem('${item.id}')">
        <div class="map-quick-icon ${iconClass}">${iconChar}</div>
        <div class="map-quick-info">
          <div class="map-quick-name">${item.name}</div>
          <div class="map-quick-sub">${item.badge}</div>
        </div>
      </div>
    `;
  }).join("");
}

// 특정 장소로 지도 포커스 이동 & 팝업 열기
window.focusOnMapItem = function(placeId) {
  const target = travelData.find(p => p.id === placeId);
  if (!target || !map) return;

  // 지도 섹션으로 스크롤 이동
  const mapSection = document.getElementById("map");
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: "smooth" });
  }

  // 필터가 'all'이 아니면 해당 카테고리가 보이도록 초기화
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

// 8. D-Day 카운트다운 타이머 (2026-10-24 00:00:00 KST)
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
    // 여행 시작 후 또는 진행 중
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

// 9. 환갑 축하 Confetti 폭죽 효과
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

// 10. 롤링페이퍼 (축하 메시지) 관리
function loadMessages() {
  const container = document.getElementById("messages-grid");
  if (!container) return;

  let saved = localStorage.getItem("kyungju_journey_messages");
  let messages = [];

  if (saved) {
    try {
      messages = JSON.parse(saved);
    } catch (e) {
      messages = defaultMessages;
    }
  } else {
    messages = defaultMessages;
    localStorage.setItem("kyungju_journey_messages", JSON.stringify(defaultMessages));
  }

  container.innerHTML = messages.map(msg => `
    <div class="rolling-card">
      <div class="rolling-card-tape"></div>
      <div class="rolling-card-text">${escapeHtml(msg.content)}</div>
      <div class="rolling-card-footer">
        <span class="rolling-card-author">${escapeHtml(msg.author)}</span>
        <span>${msg.date}</span>
      </div>
    </div>
  `).join("");
}

function handleAddMessage(e) {
  e.preventDefault();
  const authorInput = document.getElementById("msg-author");
  const contentInput = document.getElementById("msg-content");

  if (!authorInput || !contentInput) return;

  const author = authorInput.value.trim();
  const content = contentInput.value.trim();

  if (!author || !content) {
    showToast("작성자와 축하 메시지를 모두 입력해주세요!");
    return;
  }

  const newMsg = {
    id: "msg-" + Date.now(),
    author: author,
    content: content,
    date: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\./g, ".").replace(/\s/g, "")
  };

  let saved = localStorage.getItem("kyungju_journey_messages");
  let messages = saved ? JSON.parse(saved) : defaultMessages;
  messages.unshift(newMsg);
  localStorage.setItem("kyungju_journey_messages", JSON.stringify(messages));

  loadMessages();
  contentInput.value = "";
  showToast("따뜻한 축하 메시지가 등록되었습니다! 💌");
  triggerCelebration();
}

// 11. 클립보드 주소 복사
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

// 12. 웹사이트 링크 공유
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

// 13. 토스트 알림창
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

// 14. HTML 이스케이프 유틸
function escapeHtml(string) {
  return String(string)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 15. DOMContentLoaded 이벤트 바인딩
document.addEventListener("DOMContentLoaded", () => {
  // 지도 초기화
  initMap();

  // 지도 필터 버튼 이벤트
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateMapMarkers(btn.dataset.filter);
    });
  });

  // 일정 타임라인 탭 전환
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
    });
  });

  // 메시지 폼 이벤트
  const msgForm = document.getElementById("message-form");
  if (msgForm) {
    msgForm.addEventListener("submit", handleAddMessage);
  }
  loadMessages();

  // 모바일 메뉴 토글 및 자동 닫힘 처리
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle("open");
      mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // 모바일 메뉴 내 링크 클릭 시 메뉴 닫기
    const navLinks = navMenu.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (navMenu.classList.contains("open")) {
          navMenu.classList.remove("open");
          mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
      });
    });

    // 화면 바깥 클릭 시 메뉴 닫기
    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove("open");
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  // D-Day 타이머 갱신
  updateCountdown();
  setInterval(updateCountdown, 1000);
});
