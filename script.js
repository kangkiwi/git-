// =====================================
// 실시간 암호화폐 가격 변동 추적기
// =====================================

const API_URL = "https://api4.binance.com/api/v3/ticker/24hr";
const STORAGE_KEY = "favorites";

// DOM 요소
const coinList = document.getElementById("coin-list");
const searchInput = document.getElementById("search");
const statusText = document.getElementById("status");
const tabButtons = document.querySelectorAll(".tab-btn");

// 상태
let coins = []; // USDT 코인 목록
let currentTab = "all"; // "all" | "favorites"
let keyword = ""; // 검색어
let favorites = loadFavorites(); // 관심항목 (심볼 배열)
let isFetching = false; // 요청 중복 방지

// ---------- LocalStorage ----------
function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

function toggleFavorite(symbol) {
  if (favorites.includes(symbol)) {
    favorites = favorites.filter((s) => s !== symbol);
  } else {
    favorites.push(symbol);
  }
  saveFavorites();
  render();
}

// ---------- API 요청 ----------
async function fetchCoins() {
  if (isFetching) return; // 이전 요청이 끝나지 않았으면 건너뜀
  isFetching = true;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // USDT 마켓만, 거래 중단(가격 0) 항목 제외
    coins = data.filter(
      (coin) => coin.symbol.endsWith("USDT") && Number(coin.lastPrice) > 0
    );

    statusText.textContent = `마지막 업데이트: ${new Date().toLocaleTimeString()}`;
    statusText.classList.remove("error");
    render();
  } catch (err) {
    console.error(err);
    statusText.textContent = "데이터를 불러오지 못했습니다. 다시 시도 중...";
    statusText.classList.add("error");
  } finally {
    isFetching = false;
  }
}

// ---------- 포맷 ----------
function formatNumber(value) {
  return Number(value).toLocaleString("en-US", { maximumFractionDigits: 8 });
}

function formatPercent(value) {
  const num = Number(value);
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}

// ---------- 렌더링 ----------
function render() {
  let list = coins;

  // 탭 필터
  if (currentTab === "favorites") {
    list = list.filter((coin) => favorites.includes(coin.symbol));
  }

  // 검색 필터
  if (keyword) {
    list = list.filter((coin) => coin.symbol.includes(keyword));
  }

  if (list.length === 0) {
    const message =
      currentTab === "favorites" && !keyword
        ? "관심항목이 없습니다. ☆를 눌러 추가해보세요."
        : "검색 결과가 없습니다.";
    coinList.innerHTML = `<tr><td colspan="6" class="empty">${
      coins.length ? message : "불러오는 중..."
    }</td></tr>`;
    return;
  }

  coinList.innerHTML = list
    .map((coin) => {
      const isFav = favorites.includes(coin.symbol);
      const change = Number(coin.priceChangePercent);
      const changeClass = change > 0 ? "up" : change < 0 ? "down" : "";

      return `
        <tr>
          <td>
            <button class="star-btn ${isFav ? "on" : ""}" data-symbol="${coin.symbol}"
              aria-label="관심항목 ${isFav ? "해제" : "추가"}">
              ${isFav ? "★" : "☆"}
            </button>
          </td>
          <td class="symbol">${coin.symbol}</td>
          <td>${formatNumber(coin.lastPrice)}</td>
          <td class="${changeClass}">${formatPercent(change)}</td>
          <td>${formatNumber(coin.highPrice)}</td>
          <td>${formatNumber(coin.lowPrice)}</td>
        </tr>`;
    })
    .join("");
}

// ---------- 이벤트 ----------
// 별 버튼 클릭 (이벤트 위임)
coinList.addEventListener("click", (e) => {
  const btn = e.target.closest(".star-btn");
  if (btn) toggleFavorite(btn.dataset.symbol);
});

// 검색
searchInput.addEventListener("input", (e) => {
  keyword = e.target.value.trim().toUpperCase();
  render();
});

// 탭 전환
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
    render();
  });
});

// ---------- 시작 ----------
fetchCoins(); // 첫 로딩
setInterval(fetchCoins, 1000); // 1초마다 갱신
