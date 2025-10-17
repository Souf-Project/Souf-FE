import axios from "axios";
import { UserStore } from "../store/userStore";

const SERVER_URL = import.meta.env.VITE_BASE_URL;

const client = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 재발급 중복 요청 방지
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// 요청 인터셉터 추가
client.interceptors.request.use(
  (config) => {
    //const { accessToken } = UserStore.getState();
    const accessToken = localStorage.getItem("accessToken");
    // console.log("🔑 요청 인터셉터 - 현재 액세스 토큰:", accessToken);
    
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
      // console.log("✅ Authorization 헤더 설정됨:", `Bearer ${accessToken.substring(0, 20)}...`);
    } else {
      console.log("❌ 액세스 토큰이 없음");
    }
    
    return config;
  },
  (error) => {
    console.error("❌ 요청 인터셉터 에러:", error);
    return Promise.reject(error);
  }
);
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;

    console.log("응답 인터셉터 - 에러 상태:", status);
    console.log("응답 인터셉터 - 에러 URL:", originalRequest?.url);

    if ((status === 403 || status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;

      // 1. 헤더에 새 토큰이 포함된 경우
      const newAccessToken =
        error.response.headers['new-access-token'] ||
        error.response.headers['New-Access-Token'] ||
        error.response.headers['X-New-Access-Token'];

      if (newAccessToken) {
        console.log("응답 헤더에서 새 토큰 발견, 재시도");

        UserStore.getState().updateAccessToken(newAccessToken);
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        try {
          return await client(originalRequest); 
        } catch (retryError) {
          console.error("🔁 재시도 요청 실패:", retryError);
          return Promise.reject(retryError); 
        }
      }
    }
    // AlertModal이 있는 페이지는 에러 페이지로 이동하지 않고 모달이 뜨게
    // if (status === 403) {
    //   if (!window.location.pathname.includes("/recruitDetails")) {
    //     window.location.href = "/forbidden"; 
    //   }
    // }

    // 네트워크 에러 처리
    if (error.code === "ERR_NETWORK") {
      console.error("서버 연결 실패");
    }
    return Promise.reject(error);
  }
);

export default client;