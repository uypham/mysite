const formatNumber = (num) => {
  if (num === undefined || num === null) return "";
  const [intPart] = String(num).split(".");
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const changeClass = (value) => (value < 0 ? "red" : "green");

const toQuote = (buy, sell) => ({
  buy: formatNumber(buy),
  sell: formatNumber(sell),
});

const findBy = (items, field, value) => {
  const found = items.find((item) => item[field] === value);
  if (!found) throw new Error(`Không tìm thấy ${value}`);
  return found;
};

const text = (value, className = "bold") => ({ value, className });
const price = (value, color = "") => ({
  value: formatNumber(value),
  className: `right num bold ${color}`.trim(),
});

// vang247 tables share the { name, saigon: { buy, sell, buy_change } } shape.
const toSaigonTable = (items, columns, withGap = false) => ({
  columns,
  rows: items.map((item) => ({
    className: item.saigon.buy_change < 0 ? "bg-red" : "bg-green",
    cells: [
      text(item.name, "bold blue"),
      price(item.saigon.buy),
      price(item.saigon.sell),
      price(item.saigon.buy_change, changeClass(item.saigon.buy_change)),
      ...(withGap ? [price(item.gap, changeClass(item.gap))] : []),
    ],
  })),
});

const toSaigonQuote = (items, name) => {
  const item = findBy(items, "name", name);
  return toQuote(item.saigon.buy, item.saigon.sell);
};

const SAIGON_COLUMNS = [
  { label: "Tổ chức" },
  { label: "Giá mua", right: true },
  { label: "Giá bán", right: true },
];

export const buildTongHop = (data) => ({
  gold: {
    table: toSaigonTable(
      data.vsg_gold_table,
      [
        ...SAIGON_COLUMNS,
        { label: "+/-", right: true },
        { label: "Chênh lệch", right: true },
      ],
      true,
    ),
    quote: toSaigonQuote(data.vsg_gold_table, "Vàng 999.9"),
  },
  currency: {
    table: toSaigonTable(data.currencyNationWide, [
      ...SAIGON_COLUMNS,
      { label: "Tỷ giá", right: true },
    ]),
    quote: toSaigonQuote(data.currencyNationWide, "USD"),
  },
  silver: {
    table: toSaigonTable(data.silver_price, [
      ...SAIGON_COLUMNS,
      { label: "+/-", right: true },
    ]),
    quote: toSaigonQuote(data.silver_price, "PHUQUY_1KG"),
  },
  news: (data.ContentNew || []).map((item) => ({
    title: item.title,
    content: item.content,
  })),
});

export const buildPnjGold = (items) => ({
  table: {
    columns: [
      { label: "Mã SP" },
      { label: "Tên SP" },
      { label: "Mua (K)", right: true },
      { label: "Bán (K)", right: true },
    ],
    rows: items.map((item) => ({
      cells: [
        text(item.masp, "bold blue"),
        text(item.tensp),
        price(item.giamua, "red"),
        price(item.giaban, "green"),
      ],
    })),
  },
  quote: toQuote(
    findBy(items, "masp", "RAW_9900").giamua,
    findBy(items, "masp", "RAW_9999").giamua,
  ),
});

export const buildCafefSilver = (items) => {
  const bacPhuQuy = findBy(items, "name", "Bạc thỏi Phú Quý 999 1Kilo");
  return {
    table: {
      columns: [
        { label: "Tên SP" },
        { label: "Mua (K)", right: true },
        { label: "Bán (K)", right: true },
      ],
      rows: items.map((item) => ({
        cells: [
          text(item.name, "bold blue"),
          price(item.buyPrice / 1000, "red"),
          price(item.sellPrice / 1000, "green"),
        ],
      })),
    },
    quote: toQuote(bacPhuQuy.buyPrice / 1000, bacPhuQuy.sellPrice / 1000),
  };
};

export const buildBidvCurrency = (items) => {
  const usd = findBy(items, "currency", "USD");
  return {
    table: {
      columns: [
        { label: "Mã" },
        { label: "Tên" },
        { label: "Mua (đ)", right: true },
        { label: "Bán (đ)", right: true },
        { label: "Chuyển (đ)", right: true },
      ],
      rows: items.map((item) => ({
        cells: [
          text(item.currency, "bold blue"),
          text(item.nameVI),
          price(item.muaTm, "red"),
          price(item.ban, "green"),
          price(item.muaCk, "blue"),
        ],
      })),
    },
    quote: toQuote(usd.muaTm, usd.ban),
  };
};
