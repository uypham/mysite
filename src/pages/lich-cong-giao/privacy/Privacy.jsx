import { DocSection, LcgFooter, LcgNav, SUPPORT_EMAIL, SUPPORT_PATH } from "../LcgChrome.jsx";

const NAV_LINKS = [
  { href: "#tieng-viet", label: "Tiếng Việt" },
  { href: "#english", label: "English" },
];

const UPDATED_AT = "26/10/2026";
const UPDATED_AT_EN = "October 26, 2026";

export const Privacy = () => (
  <div id="page" className="doc-page">
    <LcgNav links={NAV_LINKS} />

    <main>
      <article className="container doc" id="tieng-viet">
        <header className="doc-hero">
          <p className="eyebrow">Lịch Công giáo</p>
          <h1 className="hero-title">
            Quyền riêng tư. <span>Ngắn gọn và rõ ràng.</span>
          </h1>
          <p className="hero-meta">Cập nhật ngày {UPDATED_AT}</p>
        </header>

        <p className="card doc-summary">
          Ứng dụng <span>không thu thập bất kỳ dữ liệu nào</span>. Không tài khoản, không quảng
          cáo, không theo dõi, và dùng được khi không có mạng.
        </p>

        <DocSection title="Dữ liệu chúng tôi thu thập">
          <p>
            Không có. Ứng dụng Lịch Công giáo trên iPhone và iPad không gửi thông tin nào về máy
            chủ, không dùng công cụ phân tích, quảng cáo hay SDK của bên thứ ba, và không theo dõi
            bạn trên các ứng dụng hay trang web khác.
          </p>
        </DocSection>

        <DocSection title="Dữ liệu lưu trên máy của bạn">
          <p>Một số cài đặt được lưu ngay trên thiết bị để ứng dụng nhớ lựa chọn của bạn:</p>
          <ul>
            <li>Ngôn ngữ và các tuỳ chọn trong mục Cài đặt.</li>
            <li>Cài đặt nhắc lễ: bật hay tắt, nhắc trước mấy ngày, giờ nhắc.</li>
          </ul>
          <p>
            Các cài đặt này được chia sẻ giữa ứng dụng và widget của chính nó trên cùng máy, không
            rời khỏi thiết bị. Xoá ứng dụng là xoá hết.
          </p>
        </DocSection>

        <DocSection title="Thông báo nhắc lễ">
          <p>
            Lời nhắc Lễ trọng mặc định tắt. Khi bạn bật, ứng dụng xin quyền gửi thông báo và tự lên
            lịch thông báo ngay trên máy. Không có máy chủ nào gửi thông báo cho bạn. Bạn có thể
            tắt bất cứ lúc nào trong ứng dụng hoặc trong Cài đặt của máy.
          </p>
        </DocSection>

        <DocSection title="Liên kết ra bên ngoài">
          <p>
            Ứng dụng có liên kết tới bài đọc và nguồn tham khảo như kpv.vn, Vatican News,
            cgvdt.vn, GCatholic.org. Các trang này mở trong trình duyệt và có chính sách riêng của
            họ. Khi bạn chia sẻ một ngày lễ, ứng dụng dùng bảng chia sẻ của iOS và không biết bạn
            gửi cho ai.
          </p>
        </DocSection>

        <DocSection title="Trẻ em">
          <p>
            Ứng dụng phù hợp mọi lứa tuổi và không thu thập dữ liệu của bất kỳ ai, kể cả trẻ em.
          </p>
        </DocSection>

        <DocSection title="Trang web này">
          <p>
            Trang uypham.com chỉ lưu lựa chọn giao diện sáng hoặc tối trong trình duyệt của bạn.
            Phông chữ được tải từ Google Fonts.
          </p>
        </DocSection>

        <DocSection title="Thay đổi và liên hệ">
          <p>
            Nếu chính sách thay đổi, trang này sẽ được cập nhật cùng ngày sửa đổi ở trên. Mọi câu
            hỏi xin gửi về <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> hoặc xem{" "}
            <a href={SUPPORT_PATH}>trang hỗ trợ</a>.
          </p>
        </DocSection>
      </article>

      <article className="container doc" id="english" lang="en">
        <header className="doc-hero">
          <p className="eyebrow">Catholic Calendar</p>
          <h2 className="hero-title">
            Privacy. <span>Short and simple.</span>
          </h2>
          <p className="hero-meta">Last updated {UPDATED_AT_EN}</p>
        </header>

        <p className="card doc-summary">
          The app <span>collects no data at all</span>. No account, no ads, no tracking, and it
          works offline.
        </p>

        <DocSection title="Data we collect">
          <p>
            None. The Catholic Calendar app for iPhone and iPad sends nothing to any server, uses
            no analytics, advertising or third-party SDKs, and does not track you across other apps
            or websites.
          </p>
        </DocSection>

        <DocSection title="Data stored on your device">
          <p>
            Your language and reminder settings are saved on your device and shared
            only with the app&apos;s own widget. They never leave the device and are removed when
            you delete the app.
          </p>
        </DocSection>

        <DocSection title="Reminders">
          <p>
            Solemnity reminders are off by default. If you turn them on, the app asks for
            notification permission and schedules local notifications on your device. No server
            sends them, and you can turn them off at any time.
          </p>
        </DocSection>

        <DocSection title="Links and sharing">
          <p>
            Links to readings and sources (kpv.vn, Vatican News, cgvdt.vn, GCatholic.org) open in
            your browser and follow those sites&apos; own policies. Sharing a day uses the iOS
            share sheet; the app does not see who you share with.
          </p>
        </DocSection>

        <DocSection title="Contact">
          <p>
            Questions? Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or visit the{" "}
            <a href={SUPPORT_PATH}>support page</a>.
          </p>
        </DocSection>
      </article>
    </main>

    <LcgFooter />
  </div>
);
