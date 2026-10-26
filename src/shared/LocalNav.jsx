export const LocalNav = ({ brand, brandHref, label, links, theme, onToggleTheme }) => (
  <header className="local-nav">
    <div className="container local-nav-inner">
      <a className="local-brand" href={brandHref}>
        {brand}
      </a>
      <nav className="local-links" aria-label={label}>
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className={`theme-toggle ${theme === "moon" ? "day" : "moon"}`}
        onClick={onToggleTheme}
        aria-label="Đổi giao diện sáng tối"
      />
    </div>
  </header>
);
