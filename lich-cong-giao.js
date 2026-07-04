const WEEKDAY_LABELS = [
  "Chủ nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

const RANK_META = {
  feria: {
    label: "Ngày thường",
    badgeClass: "feria",
  },
  solemn: {
    label: "Lễ trọng / Chúa nhật",
    badgeClass: "solemn",
  },
  feast: {
    label: "Lễ kính",
    badgeClass: "feast",
  },
  memorial: {
    label: "Lễ nhớ",
    badgeClass: "memorial",
  },
};

const VESTMENT_META = {
  white: {
    label: "Áo lễ: Trắng",
    dotClass: "white",
  },
  green: {
    label: "Áo lễ: Xanh",
    dotClass: "green",
  },
  red: {
    label: "Áo lễ: Đỏ",
    dotClass: "red",
  },
  purple: {
    label: "Áo lễ: Tím",
    dotClass: "purple",
  },
  rose: {
    label: "Áo lễ: Hồng",
    dotClass: "rose",
  },
};

const FIXED_FEASTS = {
  "01-01": {
    title: "Lễ Đức Maria, Mẹ Thiên Chúa",
    rank: "solemn",
    vestment: "white",
    gospel: "Lc 2,16-21",
  },
  "03-19": {
    title: "Thánh Giuse, Bạn Trăm Năm Đức Trinh Nữ Maria",
    rank: "solemn",
    vestment: "white",
    gospel: "Mt 1,16.18-21.24a",
  },
  "06-29": {
    title: "Thánh Phêrô và Thánh Phaolô, Tông đồ",
    rank: "solemn",
    vestment: "red",
    gospel: "Mt 16,13-19",
  },
  "08-15": {
    title: "Đức Mẹ Hồn Xác Lên Trời",
    rank: "solemn",
    vestment: "white",
    gospel: "Lc 1,39-56",
  },
  "11-01": {
    title: "Lễ Các Thánh",
    rank: "solemn",
    vestment: "white",
    gospel: "Mt 5,1-12a",
  },
  "12-08": {
    title: "Đức Mẹ Vô Nhiễm Nguyên Tội",
    rank: "solemn",
    vestment: "white",
    gospel: "Lc 1,26-38",
  },
  "12-25": {
    title: "Lễ Giáng Sinh",
    rank: "solemn",
    vestment: "white",
    gospel: "Ga 1,1-18",
  },
};

const DEFAULT_SUNDAY_GOSPEL = [
  "Mt 14,22-33",
  "Mc 6,30-34",
  "Lc 10,38-42",
  "Ga 6,24-35",
  "Mt 25,14-30",
];

const DEFAULT_WEEKDAY_GOSPEL = [
  "Mt 5,13-16",
  "Mt 7,7-12",
  "Mc 8,1-10",
  "Lc 9,1-6",
  "Lc 11,9-13",
  "Ga 15,9-17",
  "Ga 6,37-40",
  "Mt 20,20-28",
];

const monthOverrideCache = new Map();
const movableFeastCache = new Map();

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatMonthForFile = (month) => String(month).padStart(2, "0");

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const computeGregorianEaster = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  const easter = new Date(year, month - 1, day);
  easter.setHours(0, 0, 0, 0);
  return easter;
};

const getMovableFeasts = (year) => {
  if (movableFeastCache.has(year)) {
    return movableFeastCache.get(year);
  }

  const easter = computeGregorianEaster(year);
  const feastMap = new Map();
  const movableFeasts = [
    {
      date: addDays(easter, -46),
      title: "Thứ Tư Lễ Tro",
      rank: "solemn",
      vestment: "purple",
      gospel: "Mt 6,1-6.16-18",
    },
    {
      date: addDays(easter, -7),
      title: "Chúa nhật Lễ Lá",
      rank: "solemn",
      vestment: "red",
      gospel: "Lc 19,28-40",
    },
    {
      date: addDays(easter, -3),
      title: "Thứ Năm Tuần Thánh",
      rank: "solemn",
      vestment: "white",
      gospel: "Ga 13,1-15",
    },
    {
      date: addDays(easter, -2),
      title: "Thứ Sáu Tuần Thánh",
      rank: "solemn",
      vestment: "red",
      gospel: "Ga 18,1 - 19,42",
    },
    {
      date: addDays(easter, -1),
      title: "Thứ Bảy Tuần Thánh",
      rank: "solemn",
      vestment: "white",
      gospel: "Lc 24,1-12",
    },
    {
      date: easter,
      title: "Chúa nhật Phục Sinh",
      rank: "solemn",
      vestment: "white",
      gospel: "Ga 20,1-9",
    },
    {
      date: addDays(easter, 39),
      title: "Lễ Chúa Lên Trời",
      rank: "solemn",
      vestment: "white",
      gospel: "Lc 24,46-53",
    },
    {
      date: addDays(easter, 49),
      title: "Chúa nhật Hiện Xuống",
      rank: "solemn",
      vestment: "red",
      gospel: "Ga 20,19-23",
    },
    {
      date: addDays(easter, 56),
      title: "Chúa nhật Lễ Chúa Ba Ngôi",
      rank: "solemn",
      vestment: "white",
      gospel: "Ga 16,12-15",
    },
    {
      date: addDays(easter, 60),
      title: "Lễ Mình và Máu Thánh Chúa",
      rank: "solemn",
      vestment: "white",
      gospel: "Lc 9,11b-17",
    },
    {
      date: addDays(easter, 68),
      title: "Lễ Thánh Tâm Chúa Giêsu",
      rank: "solemn",
      vestment: "white",
      gospel: "Lc 15,3-7",
    },
  ];

  movableFeasts.forEach((item) => {
    feastMap.set(toIsoDate(item.date), {
      title: item.title,
      rank: item.rank,
      vestment: item.vestment,
      gospel: item.gospel,
    });
  });

  movableFeastCache.set(year, feastMap);
  return feastMap;
};

const parseIsoDate = (isoDate) => {
  const date = new Date(`${isoDate}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toRomanNumeral = (value) => {
  if (!Number.isInteger(value) || value <= 0) {
    return "";
  }

  const symbols = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let remaining = value;
  let result = "";

  for (const [number, symbol] of symbols) {
    while (remaining >= number) {
      result += symbol;
      remaining -= number;
    }
  }

  return result;
};

const parseVietnameseWeekOrdinal = (rawText) => {
  if (!rawText) return null;

  const normalized = rawText
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return null;

  const directMap = {
    mot: 1,
    hai: 2,
    ba: 3,
    bon: 4,
    tu: 4,
    nam: 5,
    lam: 5,
    sau: 6,
    bay: 7,
    tam: 8,
    chin: 9,
    muoi: 10,
  };

  if (/^\d+$/.test(normalized)) {
    const parsed = Number(normalized);
    return Number.isInteger(parsed) ? parsed : null;
  }

  const tokens = normalized.split(" ");

  if (tokens.length === 1 && directMap[tokens[0]]) {
    return directMap[tokens[0]];
  }

  if (tokens[0] === "muoi") {
    if (tokens.length === 1) return 10;
    const unit = directMap[tokens[1]];
    return unit ? 10 + unit : null;
  }

  if (tokens.length >= 2 && tokens[1] === "muoi") {
    const tens = directMap[tokens[0]];
    if (!tens) return null;

    if (tokens.length === 2) {
      return tens * 10;
    }

    const unitToken = tokens[2] === "nhat" ? "mot" : tokens[2];
    const unit = directMap[unitToken];
    return unit ? tens * 10 + unit : null;
  }

  return null;
};

const convertWeekOrdinalToRoman = (title) => {
  if (!title) return title;

  return title.replace(
    /(tuần thứ\s+)([\p{L}\d\-]+(?:\s+[\p{L}\d\-]+){0,3})(?=\s+Mùa|\s*$)/giu,
    (fullMatch, prefix, rawOrdinal) => {
      const number = parseVietnameseWeekOrdinal(rawOrdinal);
      if (!number) return fullMatch;
      return `${prefix}${toRomanNumeral(number)}`;
    },
  );
};

const getMonthDayKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
};

const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const getLiturgicalDayInfo = (date) => {
  const movableFeasts = getMovableFeasts(date.getFullYear());
  const movable = movableFeasts.get(toIsoDate(date));
  if (movable) {
    return movable;
  }

  const fixed = FIXED_FEASTS[getMonthDayKey(date)];
  if (fixed) {
    return fixed;
  }

  if (date.getDay() === 0) {
    const gospel =
      DEFAULT_SUNDAY_GOSPEL[getDayOfYear(date) % DEFAULT_SUNDAY_GOSPEL.length];
    return {
      title: "Chúa nhật Thường Niên",
      rank: "solemn",
      vestment: "green",
      gospel,
    };
  }

  const weekdayGospel =
    DEFAULT_WEEKDAY_GOSPEL[getDayOfYear(date) % DEFAULT_WEEKDAY_GOSPEL.length];

  return {
    title: "Ngày thường Mùa Quanh Năm",
    rank: "feria",
    vestment: "green",
    gospel: weekdayGospel,
  };
};

const sanitizeDayInfo = (dayInfo) => {
  const safeRank = RANK_META[dayInfo.rank] ? dayInfo.rank : "feria";
  const safeVestment = VESTMENT_META[dayInfo.vestment]
    ? dayInfo.vestment
    : "green";

  return {
    title: dayInfo.title || "Lễ trong tuần",
    rank: safeRank,
    vestment: safeVestment,
    gospel: dayInfo.gospel || "Mt 5,13-16",
  };
};

const buildDayData = (date) => {
  const info = sanitizeDayInfo(getLiturgicalDayInfo(date));
  return {
    isoDate: toIsoDate(date),
    date,
    weekday: WEEKDAY_LABELS[date.getDay()],
    dateText: formatDate(date),
    ...info,
  };
};

const buildWeekData = (baseDate) => {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + index);
    return buildDayData(date);
  });
};

const buildMonthData = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month - 1, index + 1);
    date.setHours(0, 0, 0, 0);
    return buildDayData(date);
  });
};

const toOverrideMap = (json) => {
  const map = new Map();
  const days = Array.isArray(json?.days) ? json.days : [];

  days.forEach((item) => {
    if (!item || typeof item !== "object" || !item.date) {
      return;
    }

    const date = parseIsoDate(item.date);
    if (!date) {
      return;
    }

    map.set(item.date, sanitizeDayInfo(item));
  });

  return map;
};

const fetchMonthOverrides = async (year, month) => {
  const cacheKey = `${year}-${month}`;
  if (monthOverrideCache.has(cacheKey)) {
    return monthOverrideCache.get(cacheKey);
  }

  const filePath = `./lich-cong-giao-${year}.json`;

  try {
    const response = await fetch(filePath, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Không tìm thấy ${filePath}`);
    }

    const data = await response.json();
    const monthDays = data?.months?.[String(month)] || [];
    const overrideMap = toOverrideMap({ days: monthDays });
    monthOverrideCache.set(cacheKey, overrideMap);
    return overrideMap;
  } catch (error) {
    const emptyMap = new Map();
    monthOverrideCache.set(cacheKey, emptyMap);
    return emptyMap;
  }
};

const mergeDaysWithOverrides = (days, overrideMap) => {
  return days.map((day) => {
    const override = overrideMap.get(day.isoDate);
    return override ? { ...day, ...override } : day;
  });
};

const getWeekData = async (today) => {
  const weekDays = buildWeekData(today);
  const monthKeys = [
    ...new Set(
      weekDays.map(
        (day) => `${day.date.getFullYear()}-${day.date.getMonth() + 1}`,
      ),
    ),
  ];

  const overrideMaps = await Promise.all(
    monthKeys.map((key) => {
      const [year, month] = key.split("-").map(Number);
      return fetchMonthOverrides(year, month);
    }),
  );

  const merged = weekDays.map((day) => {
    for (const map of overrideMaps) {
      const override = map.get(day.isoDate);
      if (override) {
        return { ...day, ...override };
      }
    }
    return day;
  });

  return merged;
};

const getMonthData = async (year, month) => {
  const autoDays = buildMonthData(year, month);
  const overrideMap = await fetchMonthOverrides(year, month);
  return mergeDaysWithOverrides(autoDays, overrideMap);
};

const createBadgeClass = (rank) => {
  const meta = RANK_META[rank] || RANK_META.feria;
  return meta.badgeClass;
};

const getDateTileParts = (date) => {
  return {
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

const renderTodayCard = (day) => {
  const todayCard = document.getElementById("today-card");
  const todayDate = document.getElementById("today-date");
  const todayDateTile = document.getElementById("today-date-tile");
  const todayCelebration = document.getElementById("today-celebration");
  const todayRank = document.getElementById("today-rank");
  const todayVestmentDot = document.getElementById("today-vestment-dot");
  const todayVestmentText = document.getElementById("today-vestment-text");
  const todayGospel = document.getElementById("today-gospel");

  const rankMeta = RANK_META[day.rank] || RANK_META.feria;
  const vestmentMeta = VESTMENT_META[day.vestment] || VESTMENT_META.green;
  const dateTileParts = getDateTileParts(day.date);

  todayDate.textContent = `${day.weekday}, ${day.dateText}`;
  if (todayDateTile) {
    todayDateTile.innerHTML = `<span class="date-tile-month">Tháng ${dateTileParts.month}</span><span class="date-tile-day">${dateTileParts.day}</span>`;
  }
  todayCelebration.textContent = convertWeekOrdinalToRoman(day.title);
  if (day.rank === "feria") {
    todayRank.textContent = "";
    todayRank.className = "badge";
    todayRank.style.display = "none";
  } else {
    todayRank.textContent = rankMeta.label;
    todayRank.className = `badge ${rankMeta.badgeClass}`;
    todayRank.style.display = "";
  }

  todayVestmentDot.className = `vestment-dot ${vestmentMeta.dotClass}`;
  todayVestmentText.textContent = vestmentMeta.label;

  todayGospel.textContent = day.gospel;

  if (todayCard) {
    const weekendClass =
      day.date.getDay() === 6
        ? "weekend-sat"
        : day.date.getDay() === 0
          ? "weekend-sun"
          : "";
    const rankClass = day.rank === "solemn" ? "rank-solemn" : "";
    todayCard.className = `today-card ${weekendClass} ${rankClass}`.trim();
  }
};

const renderUpcomingList = (days, options = {}) => {
  const { showWeekDividers = false, highlightIsoDate = "" } = options;
  const upcomingList = document.getElementById("upcoming-list");
  const html = days
    .map((day, index) => {
      const rankMeta = RANK_META[day.rank] || RANK_META.feria;
      const vestmentMeta = VESTMENT_META[day.vestment] || VESTMENT_META.green;
      const dateTileParts = getDateTileParts(day.date);
      const weekendClass =
        day.date.getDay() === 6
          ? "weekend-sat"
          : day.date.getDay() === 0
            ? "weekend-sun"
            : "";
      const rankClass = day.rank === "solemn" ? "rank-solemn" : "";
      const weekDivider =
        showWeekDividers && index > 0 && day.date.getDay() === 1
          ? '<div class="week-divider" aria-hidden="true"></div>'
          : "";
      const todayClass = day.isoDate === highlightIsoDate ? "is-today" : "";
      const badgeHtml =
        day.rank === "feria"
          ? ""
          : `<span class="badge ${createBadgeClass(day.rank)}">${rankMeta.label}</span>`;
      const displayTitle = convertWeekOrdinalToRoman(day.title);

      return `
        ${weekDivider}
        <article class="mini-card ${weekendClass} ${rankClass} ${todayClass}">
          <div class="mini-top">
            <div class="mini-date-wrap">
              <div class="date-tile">
                <span class="date-tile-month">Tháng ${dateTileParts.month}</span>
                <span class="date-tile-day">${dateTileParts.day}</span>
              </div>
              <div class="mini-date">${day.weekday}</div>
            </div>
            ${badgeHtml}
          </div>
          <p class="mini-title">${displayTitle}</p>
          <div class="mini-meta">
            <span class="mini-meta-item"><span aria-hidden="true">👕</span><span class="vestment-dot ${vestmentMeta.dotClass}"></span>${vestmentMeta.label.replace("Áo lễ: ", "")}</span>
            <span class="mini-meta-item right"><span aria-hidden="true">📖</span>${day.gospel}</span>
          </div>
        </article>
      `;
    })
    .join("");

  upcomingList.innerHTML = html;
};

const renderPeriodTitle = (filterValue) => {
  const titleNode = document.querySelector(".section-title");
  if (!titleNode) return;

  if (filterValue === "week") {
    titleNode.textContent = "Các ngày tiếp theo trong tuần";
    titleNode.classList.remove("month-active");
    return;
  }

  const selectedMonth = Number(filterValue.replace("month-", ""));
  titleNode.textContent = `Các ngày trong tháng ${selectedMonth}`;
  titleNode.classList.add("month-active");
};

const initThemeSwitch = () => {
  const themeSwitch = document.getElementById("theme-switch");
  let theme = localStorage.getItem("theme") || "day";
  theme = ["day", "moon"].includes(theme) ? theme : "day";

  const applyTheme = (value) => {
    document.body.classList.remove("day", "moon");
    document.body.classList.add(value);
    localStorage.setItem("theme", value);

    if (value === "moon") {
      themeSwitch.classList.remove("moon");
      themeSwitch.classList.add("day");
      themeSwitch.setAttribute("aria-label", "Chuyển sang chế độ sáng");
    } else {
      themeSwitch.classList.remove("day");
      themeSwitch.classList.add("moon");
      themeSwitch.setAttribute("aria-label", "Chuyển sang chế độ tối");
    }
  };

  applyTheme(theme);

  themeSwitch.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme") || "day";
    const nextTheme = currentTheme === "day" ? "moon" : "day";
    applyTheme(nextTheme);
  });
};

const initCalendarPage = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderByFilter = async (filterValue) => {
    renderPeriodTitle(filterValue);

    if (filterValue === "week") {
      const weekData = await getWeekData(today);
      const [todayDay, ...upcoming] = weekData;
      renderTodayCard(todayDay);
      renderUpcomingList(upcoming, { showWeekDividers: false });
      return;
    }

    const selectedMonth = Number(filterValue.replace("month-", ""));
    const todayMonthOverrides = await fetchMonthOverrides(
      today.getFullYear(),
      today.getMonth() + 1,
    );
    const todayAutoData = buildDayData(today);
    const todayOverride = todayMonthOverrides.get(todayAutoData.isoDate);
    renderTodayCard(
      todayOverride ? { ...todayAutoData, ...todayOverride } : todayAutoData,
    );

    const monthData = await getMonthData(today.getFullYear(), selectedMonth);
    renderUpcomingList(monthData, {
      showWeekDividers: true,
      highlightIsoDate: todayAutoData.isoDate,
    });
  };

  const periodFilter = document.getElementById("period-filter");
  await renderByFilter(periodFilter ? periodFilter.value : "week");

  if (periodFilter) {
    periodFilter.addEventListener("change", async (event) => {
      const nextValue = event.target.value;
      await renderByFilter(nextValue);
    });
  }

  const yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  initThemeSwitch();
};

document.addEventListener("DOMContentLoaded", initCalendarPage);
