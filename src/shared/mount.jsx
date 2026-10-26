import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

export const mount = (Page) => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Page />
    </StrictMode>,
  );
};
