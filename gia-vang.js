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

  fetch("https://edge-cf-api.pnj.io/ecom-frontend/v1/get-gold-price?zone=21")
    .then((res) => res.json())
    .then((data) => {
      const goldTableData = data.data;

      // Bảng giá vàng
      const $goldTable = document.createElement("table");
      const $goldThead = document.createElement("thead");
      $goldThead.innerHTML = `<tr class="yellow">
        <th>Mã SP</th>
        <th>Tên SP</th>
        <th class="right">Mua</th>
        <th class="right">Bán</th>
      </tr>`;
      $goldTable.append($goldThead);
      const $goldTbody = document.createElement("tbody");
      goldTableData.forEach((item) => {
        const $html = `<tr>
          <td class="bold blue">${item.masp}</td>
          <td class="bold blue">${item.tensp}</td>
          <td class="right num bold">${formatNumber(item.giamua)}</td>
          <td class="right num bold">${formatNumber(item.giaban)}</td>
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
    });
};

const getGiaBac = () => {
  const $silverMain = document.getElementById("gia-bac");
  fetch("https://apiweb.cafef.vn/api/v1/Silver/GetSilver")
    .then((res) => res.json())
    .then((silverTableData) => {
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
          <td class="right num bold">${formatNumber(item.buyPrice / 1000)}</td>
          <td class="right num bold">${formatNumber(item.sellPrice / 1000)}</td>
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
    });
};

// Khởi chạy lần đầu
getNgay();
setInterval(getNgay, 1000);

getGiaVang();
getGiaBac();
