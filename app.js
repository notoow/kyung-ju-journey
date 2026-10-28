// Map, itinerary tabs and sharing for the public travel template.
const travelData = [...extraPlaces];

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
    const order = ["museum", "cheomseongdae", "woljeonggyo"];
    filteredPlaces = order.map(id => travelData.find(p => p.id === id)).filter(Boolean);
  } else if (filterType === "day2") {
    const order = ["seokguram", "bulguksa", "bomun"];
    filteredPlaces = order.map(id => travelData.find(p => p.id === id)).filter(Boolean);
  }

  const latLngs = [];
  filteredPlaces.filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lng)).forEach(item => {
    const icon = createCustomMarkerIcon(item);
    const marker = L.marker([item.lat, item.lng], { icon: icon, title: item.name, alt: item.name }).addTo(map);
    marker.bindPopup(createPopupContent(item), { maxHeight: 250 });
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
          <div class="map-quick-name">${item.name}</div>
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
    title: "경주 여행 오픈소스 템플릿",
    text: "관광지와 음식점을 지도에서 살펴보는 여행 템플릿입니다.",
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


});
