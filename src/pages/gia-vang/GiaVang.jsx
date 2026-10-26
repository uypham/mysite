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
  backgroundColor: theme === "moon" ? "#131722" : "#ffffff",
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
  <table>
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
        <tr key={rowIndex} className={row.className}>
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

const TableCard = ({ id, className, section }) => {
  let content = <span>Đang tải, đợi tí...</span>;
  if (section.tableError) {
    content = <span className="red">{section.tableError}</span>;
  } else if (section.table) {
    content = <PriceTable table={section.table} />;
  }
  return (
    <div id={id} className={className}>
      {content}
    </div>
  );
};

const SummaryCard = ({ id, label, section }) => {
  let content = <div>Đang tải...</div>;
  if (section.quoteError) {
    content = <div className="red">{section.quoteError}</div>;
  } else if (section.quote) {
    content = (
      <div className="quote">
        <span>
          <small>Mua</small>
          {section.quote.buy}
        </span>
        <span>
          <small>Bán</small>
          {section.quote.sell}
        </span>
      </div>
    );
  }
  return (
    <div className="summary-card" id={id}>
      <h2>{label}</h2>
      {content}
    </div>
  );
};

const NewsList = ({ news }) => {
  if (news.error) return <span className="red">{news.error}</span>;
  if (!news.items) return <span>Đang tải, đợi tí...</span>;
  return (
    <div>
      {news.items.map((item, index) => (
        <details key={index}>
          <summary>{item.title}</summary>
          <div
            className="news-content"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </details>
      ))}
    </div>
  );
};

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

  return (
    <div id="page">
      <header className="topbar">
        <a className="topbar-brand" href="./gia-vang.html">
          MARKET
        </a>
        <nav className="topbar-nav" aria-label="Điều hướng thị trường">
          <a href="#gia-vang">Vàng</a>
          <a href="#gia-bac">Bạc</a>
          <a href="#tin-tuc">Tin tức</a>
        </nav>
        <span className="topbar-status">Live data</span>
      </header>
      <section className="section">
        <div className="container">
          <h2 className="title">
            <span>Giá vàng 👑</span>{" "}
            <span id="ngay">{now.toLocaleDateString("vi-VN", FORMAT_DATE_OPTIONS)}</span>
          </h2>
          <div id="quick-summary">
            <SummaryCard id="gia-vang-analytic" label="Vàng" section={market.gold} />
            <SummaryCard id="gia-bac-analytic" label="Bạc" section={market.silver} />
            <SummaryCard id="gia-usd-analytic" label="USD" section={market.currency} />
          </div>

          <h2 className="title mb">
            <span>Biểu đồ</span> giá vàng
          </h2>
          <div id="bien-dong" style={{ height: 400 }}>
            <TradingViewChart id="chart-gold" symbol="PEPPERSTONE:XAUUSD" theme={theme} />
          </div>

          <h2 className="title mb">
            <span>Biểu đồ</span> giá bạc
          </h2>
          <div id="bien-dong-bac" style={{ height: 400 }}>
            <TradingViewChart id="chart-silver" symbol="PEPPERSTONE:XAGUSD" theme={theme} />
          </div>

          <TableCard id="gia-vang" className="vang-card mt-4" section={market.gold} />
        </div>
      </section>
      <section className="section my-work">
        <div className="container">
          <h2 className="title">
            <span>Giá</span> bạc
          </h2>
          <TableCard id="gia-bac" className="vang-card" section={market.silver} />

          <h2 className="title">
            <span>Ngoại tệ</span>
          </h2>
          <TableCard id="gia-ngoai-te" className="vang-card" section={market.currency} />
        </div>
      </section>
      <section className="section white gap bottom">
        <div className="container">
          <h2 className="title mb">
            <span>Tin tức</span> thị trường
          </h2>
          <div id="tin-tuc" className="news-list">
            <NewsList news={news} />
          </div>

          <h2 className="title mb">
            <span>#fromUy</span>withlove♥️
          </h2>
          <p className="note">
            Tại điện thoại của mình quá cũ không mở được trang web của vàng 247
            nên mình sẽ lấy dữ liệu giá vàng từ API của họ để đọc giá vàng cho
            dễ thôi, chứ mình cũng không có ý định làm một trang web về giá vàng
            đâu :D
          </p>
        </div>
      </section>
      <div className="tools">
        <div className={`theme ${theme === "moon" ? "day" : "moon"}`} onClick={toggleTheme} />
      </div>
    </div>
  );
};
