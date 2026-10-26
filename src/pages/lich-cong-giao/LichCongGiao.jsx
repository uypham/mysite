import { useEffect, useState } from "react";
import { useTheme } from "../../shared/useTheme.js";
import {
  RANK_META,
  VESTMENT_META,
  buildDayData,
  convertWeekOrdinalToRoman,
  fetchMonthOverrides,
  getMonthData,
  getWeekData,
} from "./liturgy.js";

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

const getWeekendClass = (date) => {
  if (date.getDay() === 6) return "weekend-sat";
  if (date.getDay() === 0) return "weekend-sun";
  return "";
};

const getCardClass = (baseClass, day, extraClass = "") =>
  [
    baseClass,
    getWeekendClass(day.date),
    day.rank === "solemn" ? "rank-solemn" : "",
    extraClass,
  ]
    .filter(Boolean)
    .join(" ");

const getRankMeta = (rank) => RANK_META[rank] || RANK_META.feria;
const getVestmentMeta = (vestment) =>
  VESTMENT_META[vestment] || VESTMENT_META.green;

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const DateTile = ({ date, compact = false }) => (
  <div className={compact ? "date-tile compact" : "date-tile"}>
    <span className="date-tile-month">Tháng {date.getMonth() + 1}</span>
    <span className="date-tile-day">{date.getDate()}</span>
  </div>
);

const RankBadge = ({ rank }) => {
  if (rank === "feria") return null;
  const rankMeta = getRankMeta(rank);
  return <span className={`badge ${rankMeta.badgeClass}`}>{rankMeta.label}</span>;
};

const TodayCard = ({ day }) => {
  if (!day) {
    return (
      <article className="today-card" aria-live="polite">
        <div className="today-head">
          <span className="today-label">Hôm nay</span>
          <div className="today-date">Đang tải...</div>
        </div>
      </article>
    );
  }

  const vestmentMeta = getVestmentMeta(day.vestment);

  return (
    <article className={getCardClass("today-card", day)} aria-live="polite">
      <div className="today-head">
        <span className="today-label">Hôm nay</span>
        <div className="today-date-wrap">
          <DateTile date={day.date} compact />
          <div className="today-date">
            {day.weekday}, {day.dateText}
          </div>
        </div>
      </div>
      <h2 className="today-celebration">
        {convertWeekOrdinalToRoman(day.title)}
      </h2>
      <div className="meta-row">
        <RankBadge rank={day.rank} />
        <span className="vestment">
          <span className={`vestment-dot ${vestmentMeta.dotClass}`}></span>
          <span>{vestmentMeta.label}</span>
        </span>
      </div>
      <div className="gospel-box">
        <div className="gospel-row">
          <p className="gospel-title">Bài đọc Tin Mừng</p>
          <p className="gospel-text">{day.gospel}</p>
        </div>
      </div>
    </article>
  );
};

const MiniCard = ({ day, isToday }) => {
  const vestmentMeta = getVestmentMeta(day.vestment);

  return (
    <article className={getCardClass("mini-card", day, isToday ? "is-today" : "")}>
      <div className="mini-top">
        <div className="mini-date-wrap">
          <DateTile date={day.date} />
          <div className="mini-date">{day.weekday}</div>
        </div>
        <RankBadge rank={day.rank} />
      </div>
      <p className="mini-title">{convertWeekOrdinalToRoman(day.title)}</p>
      <div className="mini-meta">
        <span className="mini-meta-item">
          <span aria-hidden="true">👕</span>
          <span className={`vestment-dot ${vestmentMeta.dotClass}`}></span>
          {vestmentMeta.label.replace("Áo lễ: ", "")}
        </span>
        <span className="mini-meta-item right">
          <span aria-hidden="true">📖</span>
          {day.gospel}
        </span>
      </div>
    </article>
  );
};

const UpcomingItem = ({ day, showDivider, isToday }) => (
  <>
    {showDivider && <div className="week-divider" aria-hidden="true"></div>}
    <MiniCard day={day} isToday={isToday} />
  </>
);

const loadPeriod = async (filterValue) => {
  const today = getToday();

  if (filterValue === "week") {
    const [todayDay, ...upcoming] = await getWeekData(today);
    return { todayDay, days: upcoming, showWeekDividers: false, highlightIsoDate: "" };
  }

  const selectedMonth = Number(filterValue.replace("month-", ""));
  const todayMonthOverrides = await fetchMonthOverrides(
    today.getFullYear(),
    today.getMonth() + 1,
  );
  const todayAutoData = buildDayData(today);
  const todayOverride = todayMonthOverrides.get(todayAutoData.isoDate);
  const todayDay = todayOverride
    ? { ...todayAutoData, ...todayOverride }
    : todayAutoData;
  const monthData = await getMonthData(today.getFullYear(), selectedMonth);

  return {
    todayDay,
    days: monthData,
    showWeekDividers: true,
    highlightIsoDate: todayAutoData.isoDate,
  };
};

export const LichCongGiao = () => {
  const { theme, toggleTheme } = useTheme();
  const [filterValue, setFilterValue] = useState("week");
  const [period, setPeriod] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadPeriod(filterValue).then((nextPeriod) => {
      if (!cancelled) setPeriod(nextPeriod);
    });
    return () => {
      cancelled = true;
    };
  }, [filterValue]);

  const isMonth = filterValue !== "week";
  const sectionTitle = isMonth
    ? `Các ngày trong tháng ${filterValue.replace("month-", "")}`
    : "Các ngày tiếp theo trong tuần";

  return (
    <div className="page">
      <header className="top">
        <div>
          <h1 className="title">Lịch Công Giáo</h1>
        </div>
        <div className="tools">
          <button
            className={`theme ${theme === "moon" ? "day" : "moon"}`}
            aria-label={
              theme === "moon" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
            }
            title="Đổi giao diện day/moon"
            type="button"
            onClick={toggleTheme}
          ></button>
        </div>
      </header>

      <main>
        <TodayCard day={period ? period.todayDay : null} />

        <div className="section-head">
          <h3 className={isMonth ? "section-title month-active" : "section-title"}>
            {sectionTitle}
          </h3>
          <label htmlFor="period-filter" className="visually-hidden">
            Chọn khoảng thời gian
          </label>
          <select
            id="period-filter"
            className="period-filter"
            aria-label="Lọc tuần hoặc tháng"
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
          >
            <option value="week">Tuần này</option>
            {MONTHS.map((month) => (
              <option key={month} value={`month-${month}`}>
                Tháng {month}
              </option>
            ))}
          </select>
        </div>
        <section className="upcoming-list" aria-live="polite">
          {period ? (
            period.days.map((day, index) => (
              <UpcomingItem
                key={day.isoDate}
                day={day}
                showDivider={
                  period.showWeekDividers && index > 0 && day.date.getDay() === 1
                }
                isToday={day.isoDate === period.highlightIsoDate}
              />
            ))
          ) : (
            <div className="mini-card">Đang tải...</div>
          )}
        </section>

        <aside className="legend">
          Màu mức độ phụng vụ:
          <div className="legend-row">
            {["feria", "feast", "memorial", "solemn"].map((rank) => (
              <span key={rank} className="legend-chip">
                <span className={`badge ${RANK_META[rank].badgeClass}`}>
                  {RANK_META[rank].label}
                </span>
              </span>
            ))}
          </div>
        </aside>
      </main>

      <footer className="footer">
        Dữ liệu lịch hiển thị tham khảo để đọc nhanh hằng ngày •{" "}
        <span>{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};
