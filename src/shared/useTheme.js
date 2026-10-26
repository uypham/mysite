import { useEffect, useState } from "react";

const THEMES = ["day", "moon"];

const readStoredTheme = () => {
  const stored = localStorage.getItem("theme");
  return THEMES.includes(stored) ? stored : "day";
};

export const useTheme = () => {
  const [theme, setTheme] = useState(readStoredTheme);

  useEffect(() => {
    document.body.classList.remove(...THEMES);
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "day" ? "moon" : "day"));
  };

  return { theme, toggleTheme };
};
