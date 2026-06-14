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

// Khởi chạy lần đầu
getNgay();
setInterval(getNgay, 1000);

getGiaVang();
getGiaBac();
getGiaNgoaiTe();
getTinTuc();

setInterval(() => {
  getGiaVang();
  getGiaBac();
  getGiaNgoaiTe();
  getTinTuc();
}, 30000);
