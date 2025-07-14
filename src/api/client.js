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
    const { accessToken } = UserStore.getState();
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 403 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 403 && !originalRequest._retry) {
      
      // 응답 헤더에서 새로운 액세스 토큰 확인
      const newAccessToken = error.response.headers['new-access-token'] || 
                           error.response.headers['New-Access-Token'] ||
                           error.response.headers['X-New-Access-Token'];
      
      if (newAccessToken) {
        // 새로운 토큰으로 UserStore 업데이트
        UserStore.getState().updateAccessToken(newAccessToken);
        
        // localStorage도 업데이트 (백업용)
        localStorage.setItem("accessToken", newAccessToken);
        
        // 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // 원래 요청 재시도
        return client(originalRequest);
      }
    }

    // 401 에러 처리 (토큰이 완전히 만료된 경우)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // UserStore에서 로그아웃
      UserStore.getState().logout();
      
      if (window.location.pathname !== "/login") {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      }
    }

    // 네트워크 에러 처리
    if (error.code === "ERR_NETWORK") {
      console.error("서버 연결 실패");
    }

    return Promise.reject(error);
  }
);

export default client;