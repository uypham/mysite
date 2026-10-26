import { CURRENT_YEAR } from "../../shared/constants.js";
import { LocalNav } from "../../shared/LocalNav.jsx";
import { useTheme } from "../../shared/useTheme.js";

// IMPORTANT: the iOS app's AppLinks.swift opens these exact URLs; keep them in sync.
export const PRIVACY_PATH = "/lich-cong-giao/privacy";
export const SUPPORT_PATH = "/lich-cong-giao/support";
export const CALENDAR_PATH = "/lich-cong-giao.html";
export const SUPPORT_EMAIL = "uyphamvuong@gmail.com";

export const LcgNav = ({ links }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <LocalNav
      brand="Lịch Công giáo"
      brandHref={CALENDAR_PATH}
      label="Điều hướng lịch"
      links={links}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
};

export const LcgFooter = ({ children }) => (
  <footer className="footer container lcg-footer">
    {children && <p>{children}</p>}
    <p>
      © {CURRENT_YEAR} <a href="/">Uy Pham</a> · <a href={PRIVACY_PATH}>Quyền riêng tư</a> ·{" "}
      <a href={SUPPORT_PATH}>Hỗ trợ</a>
    </p>
  </footer>
);

export const DocSection = ({ title, children }) => (
  <section className="doc-section">
    <h2>{title}</h2>
    {children}
  </section>
);
