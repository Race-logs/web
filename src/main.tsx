import React from "react";
import ReactDOM from "react-dom/client";
import { PorscheDesignSystemProvider } from "@porsche-design-system/components-react";

import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PorscheDesignSystemProvider>
      <App />
    </PorscheDesignSystemProvider>
  </React.StrictMode>,
);
