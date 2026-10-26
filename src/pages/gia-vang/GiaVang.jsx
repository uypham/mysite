import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../shared/useTheme.js";
import {
  TONG_HOP_WSS_URL,
  fetchBidvCurrency,
  fetchCafefSilver,
  fetchNews,
  fetchPnjGold,
  fetchTongHop,
} from "./api.js";
import {
  buildBidvCurrency,
  buildCafefSilver,
  buildPnjGold,
  buildTongHop,
} from "./tables.js";

const FORMAT_DATE_OPTIONS = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const CHART_SCRIPT_URL =
  "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

const POLL_INTERVAL_MS = 30000;
const WSS_RECONNECT_MS = 5000;
const TONG_HOP_ERROR = "Không thể lấy giá vàng, thử lại sau nhé!";

const CHARTS = [
  { id: "gold", label: "Vàng", symbol: "PEPPERSTONE:XAUUSD", caption: "XAU/USD" },
  { id: "silver", label: "Bạc", symbol: "PEPPERSTONE:XAGUSD", caption: "XAG/USD" },
];

const NAV_LINKS = [
  { href: "#gia-vang", label: "Vàng" },
  { href: "#gia-bac", label: "Bạc" },
  { href: "#gia-ngoai-te", label: "Ngoại tệ" },
  { href: "#tin-tuc", label: "Tin tức" },
];

const buildChartConfig = (symbol, theme) => ({
  allow_symbol_change: true,
  calendar: false,
  details: false,
  hide_side_toolbar: true,
  hide_top_toolbar: false,
  hide_legend: false,
  hide_volume: false,
  hotlist: false,
  interval: "120",
  locale: "vi_VN",
  save_image: true,
  style: "1",
  symbol,
  theme: theme === "moon" ? "dark" : "light",
  timezone: "Asia/Ho_Chi_Minh",
  backgroundColor: theme === "moon" ? "#1c1c1e" : "#ffffff",
  gridColor: "rgba(46, 46, 46, 0.06)",
  watchlist: [],
  withdateranges: false,
  compareSymbols: [],
  studies: [],
  autosize: true,
});

const useNow = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
};

const TradingViewChart = ({ id, symbol, theme }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "calc(100% - 32px)";
    widget.style.width = "100%";
    // TradingView reads its config from the embed script's own body.
    const script = document.createElement("script");
    script.src = CHART_SCRIPT_URL;
    script.async = true;
    script.text = JSON.stringify(buildChartConfig(symbol, theme));
    container.innerHTML = "";
    container.appendChild(widget);
    container.appendChild(script);
    return () => {
      container.innerHTML = "";
    };
  }, [symbol, theme]);

  return (
    <div
      ref={containerRef}
      id={id}
      className="tradingview-widget-container"
      style={{ height: "100%", width: "100%" }}
    />
  );
};

const PriceTable = ({ table }) => (
  <table className="price-table">
    <thead>
      <tr>
        {table.columns.map((column) => (
          <th key={column.label} className={column.right ? "right" : undefined}>
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {table.rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.cells.map((cell, cellIndex) => (
            <td key={cellIndex} className={cell.className}>
              {cell.value}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const TableCard = ({ section }) => {
  let content = <p className="card-state">Đang tải, đợi tí...</p>;
  if (section.tableError) {
    content = <p className="card-state red">{section.tableError}</p>;
  } else if (section.table) {
    content = <PriceTable table={section.table} />;
  }
  return <div className="table-card">{content}</div>;
};

const SummaryCard = ({ anchor, eyebrow, label, tone, section }) => {
  let content = <p className="card-state">Đang tải...</p>;
  if (section.quoteError) {
    content = <p className="card-state red">{section.quoteError}</p>;
  } else if (section.quote) {
    content = (
      <div className="quote">
        <div>
          <small>Mua vào</small>
          <strong>{section.quote.buy}</strong>
        </div>
        <div>
          <small>Bán ra</small>
          <strong>{section.quote.sell}</strong>
        </div>
      </div>
    );
  }
  return (
    <a className={`summary-card ${tone || ""}`} href={`#${anchor}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h3>{label}</h3>
      {content}
    </a>
  );
};

const NewsList = ({ news }) => {
  if (news.error) return <p className="card-state red">{news.error}</p>;
  if (!news.items) return <p className="card-state">Đang tải, đợi tí...</p>;
  return news.items.map((item, index) => (
    <details key={index}>
      <summary>{item.title}</summary>
      <div className="news-content" dangerouslySetInnerHTML={{ __html: item.content }} />
    </details>
  ));
};

const ShelfHeading = ({ title, subtitle }) => (
  <h2 className="shelf-heading">
    {title} <span>{subtitle}</span>
  </h2>
);

const useMarketData = () => {
  const [market, setMarket] = useState({ gold: {}, silver: {}, currency: {} });
  const [news, setNews] = useState({});

  useEffect(() => {
    let disposed = false;
    let ws = null;
    let reconnectTimer = null;
    let pollTimer = null;

    const updateSection = (key, patch) => {
      if (disposed) return;
      setMarket((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
    };

    const setReadySection = (key, { table, quote }) => {
      updateSection(key, { table, quote, tableError: null, quoteError: null });
    };

    const setFailedSection = (key, message) => {
      updateSection(key, { tableError: message, quoteError: message });
    };

    // News is only rendered once so an open <details> is not collapsed by live updates.
    const setNewsOnce = (items) => {
      if (disposed || !items.length) return;
      setNews((prev) => (prev.items ? prev : { items }));
    };

    const applyTongHop = (data, fromWSS) => {
      if (!data) return false;
      if (!data.vsg_gold_table) {
        if (fromWSS) return false;
        updateSection("gold", {
          tableError: "Không thể lấy giá vàng từ API, đợi WSS cập nhật!",
        });
        return true;
      }
      try {
        const tongHop = buildTongHop(data);
        setReadySection("gold", tongHop.gold);
        setReadySection("currency", tongHop.currency);
        setReadySection("silver", tongHop.silver);
        setNewsOnce(tongHop.news);
        return true;
      } catch (error) {
        updateSection("gold", { tableError: error.message || TONG_HOP_ERROR });
        return false;
      }
    };

    const connectWSS = () => {
      ws = new WebSocket(TONG_HOP_WSS_URL);
      ws.onmessage = (event) => applyTongHop(JSON.parse(event.data), true);
      ws.onerror = (error) => console.error("WebSocket error:", error);
      ws.onclose = () => {
        if (disposed) return;
        reconnectTimer = setTimeout(connectWSS, WSS_RECONNECT_MS);
      };
    };

    const loadSection = (key, fetcher, builder, message) =>
      fetcher()
        .then((data) => setReadySection(key, builder(data)))
        .catch((error) => {
          console.error(message, error);
          setFailedSection(key, message);
        });

    const loadFallbackPrices = () => {
      loadSection("gold", fetchPnjGold, buildPnjGold, "Không thể tải giá vàng.");
      loadSection("silver", fetchCafefSilver, buildCafefSilver, "Không thể tải giá bạc.");
      loadSection(
        "currency",
        fetchBidvCurrency,
        buildBidvCurrency,
        "Không thể tải giá ngoại tệ.",
      );
    };

    const startFallback = () => {
      loadFallbackPrices();
      fetchNews()
        .then(setNewsOnce)
        .catch((error) => {
          console.error("Lỗi khi lấy tin tức:", error);
          if (!disposed) setNews({ error: "Không thể tải tin tức." });
        });
      pollTimer = setInterval(loadFallbackPrices, POLL_INTERVAL_MS);
    };

    fetchTongHop()
      .then((data) => applyTongHop(data, false))
      .catch((error) => {
        console.error("Error fetching gold prices:", error);
        updateSection("gold", { tableError: error.message || TONG_HOP_ERROR });
        return false;
      })
      .then((canUseWSS) => {
        if (disposed) return;
        if (canUseWSS) connectWSS();
        else startFallback();
      });

    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      clearInterval(pollTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, []);

  return { market, news };
};

export const GiaVang = () => {
  const { theme, toggleTheme } = useTheme();
  const now = useNow();
  const { market, news } = useMarketData();
  const [chartId, setChartId] = useState(CHARTS[0].id);
  const activeChart = CHARTS.find((chart) => chart.id === chartId);

  return (
    <div id="page" className="market">
      <header className="market-nav">
        <div className="container market-nav-inner">
          <a className="market-brand" href="./gia-vang.html">
            Thị trường
          </a>
          <nav className="market-links" aria-label="Điều hướng thị trường">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className={`theme-toggle ${theme === "moon" ? "day" : "moon"}`}
            onClick={toggleTheme}
            aria-label="Đổi giao diện sáng tối"
          />
        </div>
      </header>

      <section className="hero container">
        <div className="hero-text">
          <h1 className="hero-title">
            Giá vàng. <span className="nowrap">Cập nhật trực tiếp.</span>
          </h1>
          <p className="hero-meta">
            <span className="live-dot" aria-hidden="true" />
            Trực tiếp ·{" "}
            <span className="nowrap">{now.toLocaleDateString("vi-VN", FORMAT_DATE_OPTIONS)}</span>
          </p>
        </div>
      </section>

      <section className="container">
        <div className="summary-grid">
          <SummaryCard
            anchor="gia-vang"
            eyebrow="Vàng"
            label="Vàng 999.9"
            tone="gradient"
            section={market.gold}
          />
          <SummaryCard
            anchor="gia-bac"
            eyebrow="Bạc"
            label="Bạc Phú Quý 1kg"
            section={market.silver}
          />
          <SummaryCard
            anchor="gia-ngoai-te"
            eyebrow="Ngoại tệ"
            label="USD"
            tone="dark"
            section={market.currency}
          />
        </div>
      </section>

      <section className="shelf">
        <div className="container">
          <div className="shelf-head">
            <ShelfHeading title="Biểu đồ." subtitle={`Thế giới ${activeChart.caption}.`} />
            <div className="segmented" role="tablist" aria-label="Chọn biểu đồ">
              {CHARTS.map((chart) => (
                <button
                  key={chart.id}
                  type="button"
                  role="tab"
                  aria-selected={chart.id === chartId}
                  className={chart.id === chartId ? "active" : undefined}
                  onClick={() => setChartId(chart.id)}
                >
                  {chart.label}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-card">
            <TradingViewChart id="chart" symbol={activeChart.symbol} theme={theme} />
          </div>
        </div>
      </section>

      <section className="shelf" id="gia-vang">
        <div className="container">
          <ShelfHeading title="Vàng." subtitle="Giá mua bán tại các tiệm lớn." />
          <TableCard section={market.gold} />
        </div>
      </section>

      <section className="shelf" id="gia-bac">
        <div className="container">
          <ShelfHeading title="Bạc." subtitle="Thỏi, miếng và trang sức." />
          <TableCard section={market.silver} />
        </div>
      </section>

      <section className="shelf" id="gia-ngoai-te">
        <div className="container">
          <ShelfHeading title="Ngoại tệ." subtitle="Tỷ giá mua bán hôm nay." />
          <TableCard section={market.currency} />
        </div>
      </section>

      <section className="shelf" id="tin-tuc">
        <div className="container">
          <ShelfHeading title="Tin tức." subtitle="Vàng và kim loại quý." />
          <div className="news-card">
            <NewsList news={news} />
          </div>
        </div>
      </section>

      <section className="shelf">
        <div className="container">
          <p className="note-card">
            <span className="vcard">#fromUy with love ♥️</span> Điện thoại của mình quá cũ
            không mở được trang vàng 247, nên mình lấy dữ liệu từ API của họ để xem giá cho
            dễ thôi, chứ cũng không có ý định làm trang web về giá vàng đâu :D
          </p>
        </div>
      </section>

      <footer className="footer container">
        © {now.getFullYear()} Uy Pham. Dữ liệu từ vang247, PNJ, CafeF, BIDV và Vietstock.
      </footer>
    </div>
  );
};
