import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

export const mount = (Page) => {
  const container = document.getElementById("root");
  const page = (
    <StrictMode>
      <Page />
    </StrictMode>
  );
  // Built pages ship prerendered markup (scripts/prerender.js); dev serves an empty root.
  if (container.hasChildNodes()) hydrateRoot(container, page);
  else createRoot(container).render(page);
};
