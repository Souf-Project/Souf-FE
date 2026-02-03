import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/global.css";
import Router from "./router/router.jsx";
import {initGA} from "./analytics.js";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // 토큰 만료 에러는 응답 인터셉터에서 재시도하므로 React Query는 재시도하지 않음
        // 응답 인터셉터에서 재시도 성공 시 정상 응답이 반환되므로 React Query가 자동으로 성공 처리
        const isTokenExpired = error?.response?.status === 401 || 
                              (error?.response?.status === 400 && error?.response?.data?.errorKey === 'S400-6');
        if (isTokenExpired) {
          return false; // 응답 인터셉터에서 재시도하므로 React Query는 재시도하지 않음
        }
        return failureCount < 3; // 다른 에러는 최대 3번 재시도
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5분
    },
    mutations: {
      retry: (failureCount, error) => {
        // 토큰 만료 에러는 응답 인터셉터에서 재시도하므로 React Query는 재시도하지 않음
        const isTokenExpired = error?.response?.status === 401 || 
                              (error?.response?.status === 400 && error?.response?.data?.errorKey === 'S400-6');
        if (isTokenExpired) {
          return false; // 응답 인터셉터에서 재시도하므로 React Query는 재시도하지 않음
        }
        return failureCount < 1; // mutation은 최대 1번만 재시도
      },
    },
  },
});

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
