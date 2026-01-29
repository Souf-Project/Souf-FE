import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/global.css";
import Router from "./router/router.jsx";
import {initGA} from "./analytics.js";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";

const queryClient = new QueryClient();

initGA();

createRoot(document.getElementById("root")).render(
  <CookiesProvider>
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <Router />
      </StrictMode>
    </QueryClientProvider>
  </CookiesProvider>
);
