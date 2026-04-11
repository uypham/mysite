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

const getGiaVang = () => {
  const $goldMain = document.getElementById("gia-vang");
  const $goldAnalytic = document.getElementById("gia-vang-analytic");

  fetch("https://edge-cf-api.pnj.io/ecom-frontend/v1/get-gold-price?zone=21")
    .then((res) => res.json())
    .then((data) => {
      const goldTableData = data.data;
      const vangSjc = goldTableData.find((item) => item.masp === "999");
      $goldAnalytic.innerHTML = `<h2>Vàng</h2><div>Mua: <span>${formatNumber(vangSjc.giamua)}</span></div>
        <div>Bán: <span>${formatNumber(vangSjc.giaban)}</span></div>`;

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
      $silverAnalytic.innerHTML = `<h2>Bạc</h2><div>Mua: <span>${formatNumber(bacSjc.buyPrice / 1000)}</span></div>
        <div>Bán: <span>${formatNumber(bacSjc.sellPrice / 1000)}</span></div>`;

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
  fetch(
    `https://cafef.vn/du-lieu//ajax/exchangerate/ajaxratecurrency.ashx?time=${dateStr}`,
  )
    .then((res) => res.json())
    .then((data) => {
      const currencyTableData = data.Data;

      const usd = currencyTableData.find((item) => item.currencyName === "USD");
      $currencyAnalytic.innerHTML = `<h2>USD</h2><div>Mua: <span>${formatNumber(usd.buyCash)} đ</span></div>
        <div>Bán: <span>${formatNumber(usd.price)} đ</span></div>`;

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
          <td class="bold blue">${item.currencyName}</td>
          <td class="bold">${item.name}</td>
          <td class="right num bold red">${formatNumber(item.buyCash)}</td>
          <td class="right num bold green">${formatNumber(item.price)}</td>
          <td class="right num bold blue">${formatNumber(item.purchaseTransfer)}</td>
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
    "https://cafef.vn/du-lieu/ajax/GoldNews/GoldRelNews.ashx?Type=NEWS&PageIndex=1&PageSize=10",
  )
    .then((res) => res.json())
    .then((data) => {
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
}, 30000);
