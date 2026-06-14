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
  return intWithSep;
  // return decPart !== undefined
  //   ? `${intWithSep}.${decPart.substring(0, 2)}`
  //   : intWithSep;
};

const getNgay = () => {
  const $dateEle = document.getElementById("ngay");
  const today = new Date();
  $dateEle.textContent = today.toLocaleDateString("vi-VN", formatDateOptions);
};

const getGiaVang = () => {
  const $goldMain = document.getElementById("gia-vang");
  const $goldAnalytic = document.getElementById("gia-vang-analytic");

  fetch("https://edge-cf-api.pnj.io/ecom-frontend/v1/get-gold-price?zone=21")
    .then((res) => res.json())
    .then((data) => {
      const goldTableData = data.data;
      const banVangSjc = goldTableData.find((item) => item.masp === "RAW_9999");
      const muaVangSjc = goldTableData.find((item) => item.masp === "RAW_9900");
      $goldAnalytic.innerHTML = `<h2>Vàng</h2><div><span>${formatNumber(muaVangSjc.giamua)}</span> / <span>${formatNumber(banVangSjc.giamua)}</span></div>`;

      // Bảng giá vàng
      const $goldTable = document.createElement("table");
      const $goldThead = document.createElement("thead");
      $goldThead.innerHTML = `<tr class="yellow">
        <th>Mã SP</th>
        <th>Tên SP</th>
        <th class="right">Mua (K)</th>
        <th class="right">Bán (K)</th>
      </tr>`;
      $goldTable.append($goldThead);
      const $goldTbody = document.createElement("tbody");
      goldTableData.forEach((item) => {
        const $html = `<tr>
          <td class="bold blue">${item.masp}</td>
          <td class="bold">${item.tensp}</td>
          <td class="right num bold red">${formatNumber(item.giamua)}</td>
          <td class="right num bold green">${formatNumber(item.giaban)}</td>
         </tr>`;
        const $row = document.createElement("tr");
        $row.innerHTML = $html;
        $goldTbody.append($row);
      });
      $goldTable.append($goldTbody);
      $goldMain.innerHTML = "";
      $goldMain.append($goldTable);
    })
    .catch((err) => {
      console.error("Lỗi khi lấy giá vàng:", err);
      $goldMain.innerHTML = "<span class='red'>Không thể tải giá vàng.</span>";
      $goldAnalytic.innerHTML =
        "<h2>Vàng</h2><div class='red'>Không thể tải giá vàng.</div>";
    });
};

const getGiaBac = () => {
  const $silverMain = document.getElementById("gia-bac");
  const $silverAnalytic = document.getElementById("gia-bac-analytic");

  fetch("https://apiweb.cafef.vn/api/v1/Silver/GetSilver")
    .then((res) => res.json())
    .then((silverTableData) => {
      const bacSjc = silverTableData.find(
        (item) => item.name === "Bạc thỏi Phú Quý 999 1Kilo",
      );
      $silverAnalytic.innerHTML = `<h2>Bạc</h2><div><span>${formatNumber(bacSjc.buyPrice / 1000)}</span> / <span>${formatNumber(bacSjc.sellPrice / 1000)}</span></div>`;

      // Bảng giá bạc
      const $silverTable = document.createElement("table");
      const $silverThead = document.createElement("thead");
      $silverThead.innerHTML = `<tr>
        <th>Tên SP</th>
        <th class="right">Mua (K)</th>
        <th class="right">Bán (K)</th>
      </tr>`;
      $silverTable.append($silverThead);
      const $silverTbody = document.createElement("tbody");
      silverTableData.forEach((item) => {
        const $html = `<tr>
          <td class="bold blue">${item.name}</td>
          <td class="right num bold red">${formatNumber(item.buyPrice / 1000)}</td>
          <td class="right num bold green">${formatNumber(item.sellPrice / 1000)}</td>
         </tr>`;
        const $row = document.createElement("tr");
        $row.innerHTML = $html;
        $silverTbody.append($row);
      });
      $silverTable.append($silverTbody);
      $silverMain.innerHTML = "";
      $silverMain.append($silverTable);
    })
    .catch((err) => {
      console.error("Lỗi khi lấy giá bạc:", err);
      $silverMain.innerHTML = "<span class='red'>Không thể tải giá bạc.</span>";
      $silverAnalytic.innerHTML =
        "<h2>Bạc</h2><div class='red'>Không thể tải giá bạc.</div>";
    });
};

const getGiaNgoaiTe = () => {
  const $currencyMain = document.getElementById("gia-ngoai-te");
  const $currencyAnalytic = document.getElementById("gia-usd-analytic");

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(
    2,
    "0",
  )}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
  fetch(`https://bidv.com.vn/ServicesBIDV/ExchangeDetailServlet`)
    .then((res) => res.json())
    .then((data) => {
      const currencyTableData = data.data.filter(
        (i) => i.muaCk && i.muaCk !== "-",
      );

      const usd = currencyTableData.find((item) => item.currency === "USD");
      $currencyAnalytic.innerHTML = `<h2>USD</h2><div><span>${formatNumber(usd.muaTm)} đ</span> / <span>${formatNumber(usd.ban)} đ</span></div>`;

      // Bảng giá ngoại tệ
      const $currencyTable = document.createElement("table");
      const $currencyThead = document.createElement("thead");
      $currencyThead.innerHTML = `<tr>
        <th>Mã</th>
        <th>Tên</th>
        <th class="right">Mua (đ)</th>
        <th class="right">Bán (đ)</th>
        <th class="right">Chuyển (đ)</th>
      </tr>`;
      $currencyTable.append($currencyThead);
      const $currencyTbody = document.createElement("tbody");
      currencyTableData.forEach((item) => {
        const $html = `<tr>
          <td class="bold blue">${item.currency}</td>
          <td class="bold">${item.nameVI}</td>
          <td class="right num bold red">${formatNumber(item.muaTm)}</td>
          <td class="right num bold green">${formatNumber(item.ban)}</td>
          <td class="right num bold blue">${formatNumber(item.muaCk)}</td>
         </tr>`;
        const $row = document.createElement("tr");
        $row.innerHTML = $html;
        $currencyTbody.append($row);
      });
      $currencyTable.append($currencyTbody);
      $currencyMain.innerHTML = "";
      $currencyMain.append($currencyTable);
    })
    .catch((err) => {
      console.error("Lỗi khi lấy giá ngoại tệ:", err);
      $currencyMain.innerHTML =
        "<span class='red'>Không thể tải giá ngoại tệ.</span>";
      $currencyAnalytic.innerHTML =
        "<h2>USD</h2><div class='red'>Không thể tải giá ngoại tệ.</div>";
    });
};

const getTinTuc = () => {
  const $newsMain = document.getElementById("tin-tuc");
  fetch(
    "https://api.allorigins.win/raw?url=https://vietstock.vn/759/hang-hoa/vang-va-kim-loai-quy.rss",
  )
    .then((res) => res.text())
    .then((xmlText) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const items = Array.from(xmlDoc.querySelectorAll("item"));
      const data = {
        Data: items.map((item) => ({
          Title:
            item.querySelector("title") &&
            item.querySelector("title").textContent
              ? item.querySelector("title").textContent.trim()
              : "",
          SubContent:
            item.querySelector("description") &&
            item.querySelector("description").textContent
              ? item.querySelector("description").textContent.trim()
              : "",
        })),
      };

      const newsData = data.Data;
      const $newsList = document.createElement("div");
      newsData.forEach((item) => {
        const $html = `<details>
        <summary>${item.Title}</summary>
        ${item.SubContent}
      </details>`;
        const $row = document.createElement("div");
        $row.innerHTML = $html;
        $newsList.append($row);
      });
      $newsMain.innerHTML = "";
      $newsMain.append($newsList);
    })
    .catch((err) => {
      console.error("Lỗi khi lấy tin tức:", err);
      $newsMain.innerHTML = "<span class='red'>Không thể tải tin tức.</span>";
    });
};

const renderInfo = async (data, fromWSS) => {
  if (!data) return false;

  const $goldMain = document.getElementById("gia-vang");
  const $goldAnalytic = document.getElementById("gia-vang-analytic");
  const $silverAnalytic = document.getElementById("gia-bac-analytic");
  const $currencyAnalytic = document.getElementById("gia-usd-analytic");

  try {
    // Last update time
    let goldTableData = data.vsg_gold_table;
    if (!goldTableData) {
      if (fromWSS) return false;
      const $goldMain = document.getElementById("gia-vang");
      $goldMain.innerHTML = `<span class='red'>Không thể lấy giá vàng từ API, đợi WSS cập nhật!</span>`;
      return true;
    }

    // Bảng giá vàng
    const $goldTable = document.createElement("table");
    const $goldThead = document.createElement("thead");
    $goldThead.innerHTML = `<tr class="yellow">
      <th>Tổ chức</th>
      <th class="right">Giá mua</th>
      <th class="right">Giá bán</th>
      <th class="right">+/-</th>
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
      $row.classList.add(item.saigon.buy_change < 0 ? "bg-red" : "bg-green");
      $row.innerHTML = $html;
      $goldTbody.append($row);
    });
    $goldTable.append($goldTbody);
    $goldMain.innerHTML = "";
    $goldMain.append($goldTable);
    const vangSjc = goldTableData.find((item) => item.name === "Vàng 999.9");
    $goldAnalytic.innerHTML = `
      <h2>Vàng</h2>
      <div>
        <span>${formatNumber(vangSjc.saigon.buy)}</span> / <span>${formatNumber(vangSjc.saigon.sell)}</span>
      </div>
    `;

    // Bảng ngoại tệ
    const $forexMain = document.getElementById("gia-ngoai-te");
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
      $row.classList.add(item.saigon.buy_change < 0 ? "bg-red" : "bg-green");
      $row.innerHTML = $html;
      $forexTbody.append($row);
    });
    $forexTable.append($forexTbody);
    $forexMain.innerHTML = "";
    $forexMain.append($forexTable);
    const usd = forexTableData.find((item) => item.name === "USD");
    $currencyAnalytic.innerHTML = `<h2>USD</h2><div><span>${formatNumber(usd.saigon.buy)}</span> / 
        <span>${formatNumber(usd.saigon.sell)}</span></div>`;

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
      $row.classList.add(item.saigon.buy_change < 0 ? "bg-red" : "bg-green");
      $row.innerHTML = $html;
      $silverTbody.append($row);
    });
    $silverTable.append($silverTbody);
    $silverMain.innerHTML = "";
    $silverMain.append($silverTable);
    const bacSjc = silverTableData.find((i) => i.name === "PHUQUY_1KG");
    $silverAnalytic.innerHTML = `<h2>Bạc</h2><div><span>${formatNumber(bacSjc.saigon.buy)}</span>
        / <span>${formatNumber(bacSjc.saigon.sell)}</span></div>`;

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
    return true;
  } catch (error) {
    const $goldMain = document.getElementById("gia-vang");
    $goldMain.innerHTML = `<span class='red'>${error.message || "Không thể lấy giá vàng, thử lại sau nhé!"}</span>`;
    return false;
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

const getTongHop = async () => {
  try {
    const res = await fetch(
      "https://services.vang247.vn/ws-prices/api/v1/c_prices",
    );
    const data = await res.json();
    return renderInfo(data);
  } catch (error) {
    console.error("Error fetching gold prices:", error);
    const $goldMain = document.getElementById("gia-vang");
    $goldMain.innerHTML = `<span class='red'>${error.message || "Không thể lấy giá vàng, thử lại sau nhé!"}</span>`;
    return false;
  }
};

const initTools = () => {
  let theme = localStorage.getItem("theme") || "day";
  theme = ["moon", "day"].includes(theme) ? theme : "day";
  const $theme = document.getElementById("theme");

  const setTheme = (value) => {
    if (theme === "moon") {
      localStorage.setItem("theme", "moon");
      $theme.classList.remove("moon");
      $theme.classList.add("day");
    } else {
      localStorage.setItem("theme", "day");
      $theme.classList.remove("day");
      $theme.classList.add("moon");
    }
  };
  setTheme(theme);

  $theme.addEventListener("click", (event) => {
    theme = localStorage.getItem("theme") || "day";
    theme = ["moon", "day"].includes(theme) ? theme : "day";
    theme = theme === "day" ? "moon" : "day";
    setTheme(theme);
    location.reload();
  });
};

const initApp = async () => {
  initTools();

  // Khởi chạy lần đầu
  getNgay();
  setInterval(getNgay, 1000);

  // Chạy tổng hợp trước
  const can = await getTongHop();
  console.log("CAN: ", can);

  if (can) {
    // Kết nối WebSocket để nhận cập nhật giá vàng theo thời gian thực
    // connectWSS();
  } else {
    getGiaVang_Server2();
    getGiaBac_Server2();
    getGiaNgoaiTe_Server2();
    getTinTuc_Server2();
    setInterval(() => {
      getGiaVang_Server2();
      getGiaBac_Server2();
      getGiaNgoaiTe_Server2();
      getTinTuc_Server2();
    }, 30000);
  }
};

initApp();
