import { renderToString } from "react-dom/server";
import { Home } from "./pages/home/Home.jsx";
import { Bio } from "./pages/bio/Bio.jsx";
import { NotFound } from "./pages/not-found/NotFound.jsx";
import { GiaVang } from "./pages/gia-vang/GiaVang.jsx";
import { LichCongGiao } from "./pages/lich-cong-giao/LichCongGiao.jsx";

const PAGES = {
  "index.html": Home,
  "bio.html": Bio,
  "404.html": NotFound,
  "gia-vang.html": GiaVang,
  "lich-cong-giao.html": LichCongGiao,
};

export const renderPages = () =>
  Object.entries(PAGES).map(([file, Page]) => ({ file, markup: renderToString(<Page />) }));
