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

const renderInfo = async (data, fromWSS) => {
  const $goldMain = document.getElementById("gia-vang");

  try {
    // Last update time
    const goldTableData = data.vsg_gold_table;
    const $lastUpdateEle = document.getElementById("last-update");
    const lastUpdate = new Date(goldTableData[0] && goldTableData[0].update_at);
    $lastUpdateEle.textContent = `Cập nhật lúc ${lastUpdate.toLocaleTimeString("vi-VN", formatDateOptions)}`;

    // Bảng giá vàng
    const $goldTable = document.createElement("table");
    const $goldThead = document.createElement("thead");
    $goldThead.innerHTML = `<tr>
      <th>Tổ chức</th>
      <th class="right">Giá mua</th>
      <th class="right">Giá bán</th>
      <th class="right">Thay đổi mua</th>
      <th class="right">Chênh lệch</th>
    </tr>`;
    $goldTable.append($goldThead);
    const $goldTbody = document.createElement("tbody");
    goldTableData.forEach((item) => {
      const $html = `<tr>
          <td class="bold blue">${item.name}</td>
          <td class="right num bold">${formatNumber(item.saigon.buy)}</td>
          <td class="right num bold">${formatNumber(item.saigon.sell)}</td>
          <td class="right num bold ${item.saigon.buy_change < 0 ? "red" : "green"}">${formatNumber(item.saigon.buy_change)}</td>
          <td class="right num bold ${item.gap < 0 ? "red" : "green"}">${formatNumber(item.gap)}</td>
         </tr>`;
      const $row = document.createElement("tr");
      $row.innerHTML = $html;
      $goldTbody.append($row);
    });
    $goldTable.append($goldTbody);
    $goldMain.innerHTML = "";
    $goldMain.append($goldTable);

    // // Bảng ngoại tệ
    const $forexMain = document.getElementById("ngoai-te");
    const forexTableData = data.currencyNationWide;
    const $forexTable = document.createElement("table");
    const $forexThead = document.createElement("thead");
    $forexThead.innerHTML = `<tr>
      <th>Tổ chức</th>
      <th class="right">Giá mua</th>
      <th class="right">Giá bán</th>
      <th class="right">Tỷ giá</th>
    </tr>`;
    $forexTable.append($forexThead);
    const $forexTbody = document.createElement("tbody");
    forexTableData.forEach((item) => {
      const $html = `<tr>
        <td class="bold blue">${item.name}</td>
        <td class="right num bold">${formatNumber(item.saigon.buy)}</td>
        <td class="right num bold">${formatNumber(item.saigon.sell)}</td>
        <td class="right num bold ${item.saigon.buy_change < 0 ? "red" : "green"}">${formatNumber(item.saigon.buy_change)}</td>
       </tr>`;
      const $row = document.createElement("tr");
      $row.innerHTML = $html;
      $forexTbody.append($row);
    });
    $forexTable.append($forexTbody);
    $forexMain.innerHTML = "";
    $forexMain.append($forexTable);

    // Bảng bạc
    const $silverMain = document.getElementById("gia-bac");
    const silverTableData = data.silver_price;
    const $silverTable = document.createElement("table");
    const $silverThead = document.createElement("thead");
    $silverThead.innerHTML = `<tr>
      <th>Tổ chức</th>
      <th class="right">Giá mua</th>
      <th class="right">Giá bán</th>
      <th class="right">+/-</th>
    </tr>`;
    $silverTable.append($silverThead);
    const $silverTbody = document.createElement("tbody");
    silverTableData.forEach((item) => {
      const $html = `<tr>
        <td class="bold blue">${item.name}</td>
        <td class="right num bold">${formatNumber(item.saigon.buy)}</td>
        <td class="right num bold">${formatNumber(item.saigon.sell)}</td>
        <td class="right num bold ${item.saigon.buy_change < 0 ? "red" : "green"}">${formatNumber(item.saigon.buy_change)}</td>
       </tr>`;
      const $row = document.createElement("tr");
      $row.innerHTML = $html;
      $silverTbody.append($row);
    });
    $silverTable.append($silverTbody);
    $silverMain.innerHTML = "";
    $silverMain.append($silverTable);

    if (fromWSS) return;

    // Tin tức
    const $newsMain = document.getElementById("tin-tuc");
    const newsData = data.ContentNew;
    const $newsList = document.createElement("div");
    newsData.forEach((item) => {
      const $html = `<details>
        <summary>${item.title}</summary>
        ${item.content}
      </details>`;
      const $row = document.createElement("div");
      $row.innerHTML = $html;
      $newsList.append($row);
    });
    $newsMain.innerHTML = "";
    $newsMain.append($newsList);

    // Lịch kinh tế
    const $calendarMain = document.getElementById("calendar");
    const calendarData = data.Calendars;
    const $calendarList = document.createElement("div");
    calendarData.forEach((item) => {
      const time = new Date(item.time);
      const $html = `<div>${item.country} - ${item.title} (${time.toLocaleString("vi-VN", formatDateOptions)})</div>`;
      const $row = document.createElement("div");
      $row.innerHTML = $html;
      $calendarList.append($row);
    });
    $calendarMain.innerHTML = "";
    $calendarMain.append($calendarList);
  } catch (error) {
    const $goldMain = document.getElementById("gia-vang");
    $goldMain.innerHTML = `<span class='red'>${error.message || "Không thể lấy giá vàng, thử lại sau nhé!"}</span>`;
  }
};

const connectWSS = () => {
  const ws = new WebSocket("wss://vangsaigon.vn/ws-prices/ws/v1/prices");
  ws.onopen = () => {
    console.log("WebSocket connected");
  };
  ws.onmessage = (event) => {
    // Mỗi khi có tin nhắn mới, mình sẽ gọi lại API để lấy dữ liệu mới nhất
    renderInfo(JSON.parse(event.data), true);
  };
  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  ws.onclose = () => {
    console.log("WebSocket disconnected, reconnecting in 5 seconds...");
    setTimeout(connectWSS, 5000); // Thử kết nối lại sau 5 giây nếu bị ngắt
  };
};

const getGiaVang = async () => {
  try {
    const res = await fetch(
      "https://services.vang247.vn/ws-prices/api/v1/c_prices",
    );
    const data = await res.json();
    renderInfo(data);
  } catch (error) {
    console.error("Error fetching gold prices:", error);
    const $goldMain = document.getElementById("gia-vang");
    $goldMain.innerHTML = `<span class='red'>${error.message || "Không thể lấy giá vàng, thử lại sau nhé!"}</span>`;
  }
};

// Khởi chạy lần đầu
getNgay();
setInterval(getNgay, 1000);
getGiaVang();

// Kết nối WebSocket để nhận cập nhật giá vàng theo thời gian thực
connectWSS();
