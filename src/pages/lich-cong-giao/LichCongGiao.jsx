import { useEffect, useState } from "react";
import { ShelfHeading } from "../../shared/ShelfHeading.jsx";
import { LcgFooter, LcgNav, PRIVACY_PATH, SUPPORT_PATH } from "./LcgChrome.jsx";
import {
  RANK_META,
  VESTMENT_META,
  convertWeekOrdinalToRoman,
  getMonthData,
  getWeekData,
} from "./liturgy.js";

const NAV_LINKS = [
  { href: "#hom-nay", label: "Hôm nay" },
  { href: "#lich", label: "Lịch" },
  { href: "#ung-dung", label: "Ứng dụng" },
];

const MODES = [
  { id: "week", label: "Tuần này" },
  { id: "month", label: "Theo tháng" },
];

const RANK_ORDER = ["solemn", "feast", "memorial", "feria"];
const VESTMENT_ORDER = ["white", "red", "green", "purple", "rose"];

const VESTMENT_USES = {
  white: "Lễ Chúa, Đức Mẹ, các thánh không tử đạo, Mùa Giáng Sinh và Phục Sinh.",
  red: "Lễ Chúa Thánh Thần, cuộc Thương Khó, các thánh Tông đồ và tử đạo.",
  green: "Mùa Thường Niên.",
  purple: "Mùa Vọng, Mùa Chay và lễ cầu cho các linh hồn.",
  rose: "Chúa nhật III Mùa Vọng và Chúa nhật IV Mùa Chay.",
};

const APP_FEATURES = [
  "Tên lễ, bậc lễ, màu áo lễ và Tin Mừng mỗi ngày.",
  "Lịch tuần, lưới tháng và đếm ngược tới Lễ trọng kế tiếp.",
  "Nhắc Lễ trọng trước 1–7 ngày, widget màn hình chính và khoá.",
  "Chữ lớn, dễ đọc cho ông bà, cha mẹ. Chạy hoàn toàn offline.",
];

const FIRST_MONTH = 1;
const LAST_MONTH = 12;

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getRankMeta = (rank) => RANK_META[rank] || RANK_META.feria;
const getVestmentMeta = (vestment) => VESTMENT_META[vestment] || VESTMENT_META.green;
const getVestmentName = (vestment) => getVestmentMeta(vestment).label.replace("Áo lễ: ", "");

const RankBadge = ({ rank }) => {
  if (rank === "feria") return null;
  const rankMeta = getRankMeta(rank);
  return <span className={`badge ${rankMeta.badgeClass}`}>{rankMeta.label}</span>;
};

const Vestment = ({ vestment }) => (
  <span className="vestment">
    <span className={`vestment-dot ${getVestmentMeta(vestment).dotClass}`} aria-hidden="true" />
    Áo {getVestmentName(vestment).toLowerCase()}
  </span>
);

const TodayCard = ({ day }) => {
  if (!day) {
    return (
      <article className="card today-card" aria-busy="true">
        <p className="eyebrow">Hôm nay</p>
        <p className="today-title is-loading">Đang tải lịch...</p>
      </article>
    );
  }

  return (
    <article className={`card today-card vest-${getVestmentMeta(day.vestment).dotClass}`}>
      <div className="today-date">
        <span className="today-day">{day.date.getDate()}</span>
        <span className="today-month">
          <strong>{day.weekday}</strong>
          Tháng {day.date.getMonth() + 1} · {day.date.getFullYear()}
        </span>
      </div>
      <div className="today-body">
        <p className="eyebrow">Hôm nay</p>
        <h2 className="today-title">{convertWeekOrdinalToRoman(day.title)}</h2>
        <div className="day-meta">
          <RankBadge rank={day.rank} />
          <Vestment vestment={day.vestment} />
        </div>
        <p className="today-gospel">
          <small>Tin Mừng</small>
          {day.gospel}
        </p>
      </div>
    </article>
  );
};

const DayTile = ({ day }) => (
  <article className={`card day-tile ${day.date.getDay() === 0 ? "is-sunday" : ""}`}>
    <div className="day-tile-head">
      <span className="day-tile-number">{day.date.getDate()}</span>
      <span className="day-tile-weekday">{day.weekday}</span>
    </div>
    <h3>{convertWeekOrdinalToRoman(day.title)}</h3>
    <div className="day-meta">
      <RankBadge rank={day.rank} />
      <Vestment vestment={day.vestment} />
    </div>
    <p className="day-gospel">Tin Mừng {day.gospel}</p>
  </article>
);

const DayRow = ({ day, isToday }) => {
  const className = [
    "day-row",
    day.date.getDay() === 0 ? "is-sunday" : "",
    day.date.getDay() === 1 ? "is-week-start" : "",
    isToday ? "is-today" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={className}>
      <span className="day-row-date">
        <strong>{day.date.getDate()}</strong>
        {day.weekday}
      </span>
      <span className="day-row-body">
        <span className="day-row-title">{convertWeekOrdinalToRoman(day.title)}</span>
        <span className="day-meta">
          <RankBadge rank={day.rank} />
          <Vestment vestment={day.vestment} />
          <span className="day-gospel">{day.gospel}</span>
        </span>
      </span>
    </li>
  );
};

const MonthStepper = ({ month, onChange }) => (
  <div className="month-stepper">
    <button
      type="button"
      aria-label="Tháng trước"
      disabled={month <= FIRST_MONTH}
      onClick={() => onChange(month - 1)}
    >
      ‹
    </button>
    <span aria-live="polite">Tháng {month}</span>
    <button
      type="button"
      aria-label="Tháng sau"
      disabled={month >= LAST_MONTH}
      onClick={() => onChange(month + 1)}
    >
      ›
    </button>
  </div>
);

const useWeek = () => {
  const [week, setWeek] = useState(null);
  useEffect(() => {
    let cancelled = false;
    getWeekData(getToday()).then((days) => {
      if (!cancelled) setWeek(days);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return week;
};

const useMonth = (today, month) => {
  const [monthDays, setMonthDays] = useState(null);
  useEffect(() => {
    if (!today || !month) return undefined;
    let cancelled = false;
    setMonthDays(null);
    getMonthData(today.getFullYear(), month).then((days) => {
      if (!cancelled) setMonthDays(days);
    });
    return () => {
      cancelled = true;
    };
  }, [today, month]);
  return monthDays;
};

export const LichCongGiao = () => {
  // Null until mounted so date-based output never mismatches the prerendered HTML.
  const [today, setToday] = useState(null);
  const [mode, setMode] = useState("week");
  const [month, setMonth] = useState(null);
  const week = useWeek();
  const monthDays = useMonth(today, mode === "month" ? month : null);

  useEffect(() => {
    const now = getToday();
    setToday(now);
    setMonth(now.getMonth() + 1);
  }, []);

  const todayDay = week ? week[0] : null;
  const upcomingDays = week ? week.slice(1) : null;
  const todayIsoDate = todayDay ? todayDay.isoDate : "";
  const isMonth = mode === "month";

  return (
    <div id="page" className="lcg">
      <LcgNav links={NAV_LINKS} />

      <main>
        <section className="hero container">
          <div className="hero-text">
            <h1 className="hero-title">
              Lịch Công giáo. <span>Lễ, màu áo lễ và Tin Mừng mỗi ngày.</span>
            </h1>
          </div>
        </section>

        <section className="container" id="hom-nay">
          <TodayCard day={todayDay} />
        </section>

        <section className="shelf" id="lich">
          <div className="container">
            <div className="shelf-head">
              <ShelfHeading
                title={isMonth ? `Tháng ${month || ""}.` : "Tuần này."}
                subtitle={isMonth ? "Từng ngày trong tháng." : "Sáu ngày tiếp theo."}
              />
              <div className="lcg-controls">
                {isMonth && month && <MonthStepper month={month} onChange={setMonth} />}
                <div className="segmented" role="tablist" aria-label="Chọn khoảng thời gian">
                  {MODES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={item.id === mode}
                      className={item.id === mode ? "active" : undefined}
                      onClick={() => setMode(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isMonth ? (
              <ol className="card day-list" aria-busy={!monthDays}>
                {monthDays ? (
                  monthDays.map((day) => (
                    <DayRow key={day.isoDate} day={day} isToday={day.isoDate === todayIsoDate} />
                  ))
                ) : (
                  <li className="day-row is-loading">Đang tải...</li>
                )}
              </ol>
            ) : (
              <div className="day-grid" aria-busy={!upcomingDays}>
                {upcomingDays ? (
                  upcomingDays.map((day) => <DayTile key={day.isoDate} day={day} />)
                ) : (
                  <p className="card day-tile is-loading">Đang tải...</p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="shelf" id="chu-giai">
          <div className="container">
            <ShelfHeading title="Chú giải." subtitle="Bậc lễ và màu áo lễ." />
            <div className="legend-grid">
              <div className="card legend-card">
                <p className="eyebrow">Bậc lễ</p>
                <ul>
                  {RANK_ORDER.map((rank) => (
                    <li key={rank}>
                      <span className={`badge ${RANK_META[rank].badgeClass}`}>
                        {RANK_META[rank].label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card legend-card">
                <p className="eyebrow">Màu áo lễ</p>
                <ul>
                  {VESTMENT_ORDER.map((vestment) => (
                    <li key={vestment}>
                      <Vestment vestment={vestment} />
                      <span className="legend-use">{VESTMENT_USES[vestment]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="shelf" id="ung-dung">
          <div className="container">
            <ShelfHeading title="Ứng dụng." subtitle="Sắp có trên iPhone và iPad." />
            <div className="card app-card">
              <div className="app-card-text">
                <p className="eyebrow">Lịch Công giáo cho iOS</p>
                <h3>Miễn phí. Không quảng cáo. Không cần tài khoản.</h3>
                <ul>
                  {APP_FEATURES.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="app-card-links">
                <a href={PRIVACY_PATH}>Chính sách quyền riêng tư ›</a>
                <a href={SUPPORT_PATH}>Hỗ trợ và góp ý ›</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LcgFooter>Lịch để tham khảo nhanh hằng ngày.</LcgFooter>
    </div>
  );
};
