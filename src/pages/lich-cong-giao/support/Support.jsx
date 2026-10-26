import {
  CALENDAR_PATH,
  DocSection,
  LcgFooter,
  LcgNav,
  PRIVACY_PATH,
  SUPPORT_EMAIL,
} from "../LcgChrome.jsx";

const NAV_LINKS = [
  { href: "#hoi-dap", label: "Hỏi đáp" },
  { href: "#lien-he", label: "Liên hệ" },
];

const FAQS = [
  {
    question: "Dữ liệu lịch lấy từ đâu?",
    answer:
      "Ngày, tên lễ và bậc lễ tham khảo GCatholic.org; màu áo lễ và bài đọc tham khảo cgvdt.vn; lịch được đối chiếu với lịch phụng vụ của Giáo phận Xuân Lộc. Lịch dùng chung toàn quốc.",
  },
  {
    question: "Vì sao có ngày ghi “Chưa có dữ liệu”?",
    answer:
      "Dữ liệu nằm sẵn trong ứng dụng và được bổ sung theo từng phiên bản. Ứng dụng không tự đoán bài đọc hay màu áo lễ, nên phần nào chưa được kiểm tra sẽ ghi rõ là chưa có.",
  },
  {
    question: "Sao ứng dụng không hiện toàn văn bài đọc?",
    answer:
      "Vì lý do bản quyền, ứng dụng chỉ ghi đoạn Tin Mừng và dẫn link tới trang của Nhóm Phiên Dịch Các Giờ Kinh Phụng Vụ (kpv.vn) và Vatican News.",
  },
  {
    question: "Bật nhắc Lễ trọng thế nào?",
    answer:
      "Vào Cài đặt trong ứng dụng, bật Nhắc trước ngày lễ rồi chọn số ngày và giờ nhắc. Nếu không thấy thông báo, hãy mở Cài đặt của máy, chọn Lịch Công giáo và bật Thông báo.",
  },
  {
    question: "Thêm widget ra màn hình chính thế nào?",
    answer:
      "Chạm và giữ vào chỗ trống trên màn hình chính, chọn Sửa rồi Thêm tiện ích, tìm Lịch Công giáo và chọn kích thước bạn thích. Màn hình khoá cũng làm tương tự khi tuỳ chỉnh.",
  },
  {
    question: "Đổi sang tiếng Anh được không?",
    answer:
      "Được. Ứng dụng theo ngôn ngữ của máy, và bạn có thể chọn Tiếng Việt hoặc English trong Cài đặt của ứng dụng. Widget và thông báo cũng đổi theo.",
  },
  {
    question: "Ứng dụng có cần mạng hay tài khoản không?",
    answer:
      "Không. Ứng dụng miễn phí, không quảng cáo, không cần tài khoản và chạy hoàn toàn offline. Chỉ khi bạn mở link bài đọc thì trình duyệt mới cần mạng.",
  },
];

const EMAIL_SUBJECT = encodeURIComponent("Góp ý Lịch Công giáo");

export const Support = () => (
  <div id="page" className="doc-page">
    <LcgNav links={NAV_LINKS} />

    <main>
      <div className="container doc">
        <header className="doc-hero">
          <p className="eyebrow">Lịch Công giáo</p>
          <h1 className="hero-title">
            Hỗ trợ. <span>Hỏi đáp và góp ý về lịch.</span>
          </h1>
          <p className="hero-meta">
            Thấy ngày lễ hay bài đọc nào chưa đúng? Xin cho mình biết để lịch ngày càng chính xác
            hơn.
          </p>
        </header>

        <section className="doc-section" id="hoi-dap">
          <h2>Câu hỏi thường gặp</h2>
          <div className="card faq accordion">
            {FAQS.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="doc-section" id="lien-he">
          <h2>Liên hệ</h2>
          <p>
            Khi báo sai sót, bạn ghi giúp ngày, tên lễ và chỗ chưa đúng. Mình sẽ trả lời sớm nhất
            có thể.
          </p>
          <a className="card contact-card" href={`mailto:${SUPPORT_EMAIL}?subject=${EMAIL_SUBJECT}`}>
            <p className="eyebrow">Email</p>
            <h3>{SUPPORT_EMAIL}</h3>
            <span className="tile-link">Gửi góp ý ›</span>
          </a>
        </section>

        <DocSection title="Xem thêm">
          <ul>
            <li>
              <a href={PRIVACY_PATH}>Chính sách quyền riêng tư</a>
            </li>
            <li>
              <a href={CALENDAR_PATH}>Lịch Công giáo trên web</a>
            </li>
          </ul>
        </DocSection>
      </div>
    </main>

    <LcgFooter />
  </div>
);
