/**
 * Tại điện thoại của mình quá cũ không mở được trang web của vàng 247 nên mình sẽ lấy dữ liệu giá vàng từ API của họ.
 * Để đọc giá vàng cho dễ thôi, chứ mình cũng không có ý định làm một trang web về giá vàng đâu :D
 */

export const TONG_HOP_WSS_URL = "wss://vangsaigon.vn/ws-prices/ws/v1/prices";

const fetchJson = (url) => fetch(url).then((res) => res.json());

export const fetchTongHop = () =>
  fetchJson("https://services.vang247.vn/ws-prices/api/v1/c_prices");

export const fetchPnjGold = () =>
  fetchJson(
    "https://edge-cf-api.pnj.io/ecom-frontend/v1/get-gold-price?zone=21",
  ).then((data) => data.data);

export const fetchCafefSilver = () =>
  fetchJson("https://apiweb.cafef.vn/api/v1/Silver/GetSilver");

export const fetchBidvCurrency = () =>
  fetchJson("https://bidv.com.vn/ServicesBIDV/ExchangeDetailServlet").then(
    (data) => data.data.filter((item) => item.muaCk && item.muaCk !== "-"),
  );

const readXmlText = (item, selector) => {
  const node = item.querySelector(selector);
  return node && node.textContent ? node.textContent.trim() : "";
};

export const fetchNews = () =>
  fetch(
    "https://api.allorigins.win/raw?url=https://vietstock.vn/759/hang-hoa/vang-va-kim-loai-quy.rss",
  )
    .then((res) => res.text())
    .then((xmlText) => {
      const xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");
      const items = Array.from(xmlDoc.querySelectorAll("item"));
      return items.map((item) => ({
        title: readXmlText(item, "title"),
        content: readXmlText(item, "description"),
      }));
    });
