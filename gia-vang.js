/**
 * Tại điện thoại của mình quá cũ không mở được trang web của vàng 247 nên mình sẽ lấy dữ liệu giá vàng từ API của họ.
 * Để đọc giá vàng cho dễ thôi, chứ mình cũng không có ý định làm một trang web về giá vàng đâu :D
 */

const formatDateOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return "";
  const str = String(num);
  const [intPart, decPart] = str.split(".");
  const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined
    ? `${intWithSep}.${decPart.substring(0, 2)}`
    : intWithSep;
};

const getNgay = () => {
  const $dateEle = document.getElementById("ngay");
  const today = new Date();
  $dateEle.textContent = today.toLocaleDateString("vi-VN", formatDateOptions);
};

// Khởi chạy lần đầu
getNgay();
setInterval(getNgay, 1000);
