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
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

// 헤더에서 AccessToken 추출
const extractTokenFromHeaders = (headers) => {
  return headers['new-access-token'] || 
         headers['New-Access-Token'] || 
         headers['accessToken'];
};

// 응답에서 AccessToken 추출
const extractTokenFromResponse = (response) => {
  return response.data?.result?.accessToken || 
         response.data?.accessToken ||
         extractTokenFromHeaders(response.headers);
};

// 쿠키에서 값 읽기
export const getCookie = (name) => {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
  return value || null;
};

// 쿠키 저장 함수
export const setCookie = (name, value, days = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const expiresString = expires.toUTCString();
  
  // 기본 경로로 쿠키 설정
  document.cookie = `${name}=${value}; expires=${expiresString}; path=/; SameSite=Lax`;
  
  // 도메인 포함 쿠키 설정 (서브도메인 포함)
  document.cookie = `${name}=${value}; expires=${expiresString}; path=/; domain=${window.location.hostname}; SameSite=Lax`;

};

// 토큰 저장
const saveTokens = (accessToken, refreshToken = null) => {
  UserStore.getState().updateAccessToken(accessToken);
  localStorage.setItem("accessToken", accessToken);
  
  // refreshToken이 제공된 경우에만 저장 (서버에서 쿠키로 관리하는 경우가 많음)
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
    // 리프레시 토큰을 쿠키에도 저장 (fallback)
   
    setCookie("refreshToken", refreshToken, 30);
    
  } else {
    // refreshToken이 없으면 쿠키에서 확인
    setTimeout(() => {
      const refreshTokenFromCookie = getCookie("refreshToken"); 
                                    
      if (refreshTokenFromCookie) {
        localStorage.setItem("refreshToken", refreshTokenFromCookie);
      
      }
    }, 100);
  }
};

// 쿠키 삭제 헬퍼 함수
const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
};

// 강제 로그아웃 처리 (refresh 실패 시)
const handleRefreshFailure = async () => {
  try {
    // 1. 로그아웃 API 호출 (204 응답 확인)
    const logoutResponse = await axios.post(
      `${SERVER_URL}/api/v1/auth/logout`,
      {},
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    
    // 204 응답 확인
    if (logoutResponse.status === 204) {
      // console.log("로그아웃 API 호출 성공 (204)");
    } else {
      console.warn("로그아웃 API 응답 코드:", logoutResponse.status);
    }
  } catch (logoutError) {
    // 로그아웃 API 실패해도 클라이언트 토큰은 정리
    console.error("로그아웃 API 호출 실패:", logoutError);
  } finally {
    // 2. 클라이언트에서 토큰 정리
    UserStore.getState().logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    // 3. 쿠키에서 RT 삭제 이름뭐지... 
    deleteCookie("refreshToken");
    deleteCookie("RefreshToken");
    deleteCookie("refresh_token");
    
    // 4. 로그인 만료 모달 표시를 위한 커스텀 이벤트 발생
    const event = new CustomEvent('showSessionExpiredModal', {
      detail: {
        message: "로그인 시간이 만료되었습니다. 재로그인해주세요"
      }
    });
    window.dispatchEvent(event);
    
    // 5. 로그인 페이지로 리다이렉트 (모달 닫힌 후 이동)
    // 모달에서 처리하도록 주석 처리
    // if (!window.location.pathname.includes('/login')) {
    //   window.location.href = '/login';
    // }
  }
};

// 토큰 재발급 API 호출
const refreshAccessToken = async () => {
  // localStorage와 쿠키 둘 다에서 refreshToken 확인
  const refreshTokenFromStorage = localStorage.getItem("refreshToken");
  const refreshTokenFromCookie = getCookie("refreshToken") 
  
  const refreshToken = refreshTokenFromStorage || refreshTokenFromCookie;
  
  // 쿠키로 refreshToken이 전송되므로 withCredentials: true만 사용
  // body에 refreshToken을 보내지 않아도 쿠키로 자동 전송됨
  const response = await axios.post(
    `${SERVER_URL}/api/v1/auth/refresh`,
    {},
    { withCredentials: true, headers: { "Content-Type": "application/json" } }
  );
  
  console.log("✅ refresh API 응답:", response.status, response.data);
  
  const newAccessToken = extractTokenFromResponse(response);
  if (!newAccessToken) {
    throw new Error("토큰 재발급 응답에 새 토큰이 없습니다");
  }
  
  // 새 refreshToken은 쿠키로 받아옴
  setTimeout(() => {
    const newRefreshTokenFromCookie = getCookie("refreshToken")
    if (newRefreshTokenFromCookie) {
      localStorage.setItem("refreshToken", newRefreshTokenFromCookie);
     
    } else {
      // 응답 데이터에 refreshToken이 있는 경우 (fallback)
      const newRefreshToken = response.data?.result?.refreshToken || response.data?.refreshToken;
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
       
      } else {
      }
    }
  }, 100);
  
  // 새 accessToken 저장
  saveTokens(newAccessToken);
  
  return newAccessToken;
};

// 요청에 토큰 적용 및 재시도
const retryRequest = (originalRequest, token) => {
  // 원본 요청의 모든 정보를 보존하면서 새 토큰으로 재시도
  // axios config 객체를 직접 수정하여 모든 속성 보존
  const retryConfig = {
    ...originalRequest,
    // Authorization 헤더만 업데이트
    headers: {
      ...originalRequest.headers,
      Authorization: `Bearer ${token}`,
    },
    // _retry 플래그를 제거하여 정상 요청으로 처리 (무한 루프 방지)
    _retry: undefined,
  };
  
  // 원본 요청의 모든 데이터 보존 (JSON, FormData, Blob 등)
  // data는 이미 originalRequest에 포함되어 있으므로 별도 처리 불필요
  
  console.log("🔄 실패한 요청 재시도:", {
    method: retryConfig.method,
    url: retryConfig.url,
    hasData: !!retryConfig.data,
    dataType: retryConfig.data ? (retryConfig.data instanceof FormData ? 'FormData' : typeof retryConfig.data) : 'none',
  });
  
  return client(retryConfig);
};

// 요청 인터셉터 추가
client.interceptors.request.use(
  (config) => {
    //const { accessToken } = UserStore.getState();
    const accessToken = localStorage.getItem("accessToken");
    // console.log("요청 인터셉터 - 현재 액세스 토큰:", accessToken);
    
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
      // console.log("Authorization 헤더 설정됨:", `Bearer ${accessToken.substring(0, 20)}...`);
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

    // console.log("응답 인터셉터 - 에러 상태:", status);
    // console.log("응답 인터셉터 - 에러 URL:", originalRequest?.url);

    // 401 에러 발생 시 토큰 재발급 시도
    if (status === 401 && !originalRequest._retry) {
      const requestUrl = originalRequest.url || originalRequest._fullUrl || '';
      
      // refresh API 호출 자체가 실패한 경우 (RT가 유효하지 않음)
      if (requestUrl.includes('/api/v1/auth/refresh')) {
        await handleRefreshFailure();
        return Promise.reject(error);
      }

      console.log("🔐 401 에러 발생 - 토큰 재발급 후 요청 재시도:", {
        method: originalRequest.method,
        url: originalRequest.url,
        hasData: !!originalRequest.data,
      });
      
      originalRequest._retry = true;

      // 1. 헤더에 새 토큰이 포함된 경우
      const headerToken = extractTokenFromHeaders(error.response?.headers);
      if (headerToken) {
        console.log("✅ 헤더에서 새 토큰 발견 - 요청 재시도");
        saveTokens(headerToken);
        return retryRequest(originalRequest, headerToken).catch(err => {
          console.error("❌ 재시도 요청 실패:", err);
          return Promise.reject(err);
        });
      }

      // 2. refresh API 호출
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshAccessToken();
          console.log("✅ 토큰 재발급 성공 - 대기 중인 모든 요청 재시도");
          processQueue(null, newAccessToken);
          return retryRequest(originalRequest, newAccessToken);
        } catch (refreshError) {
          console.error("❌ 토큰 재발급 실패:", refreshError);
          processQueue(refreshError, null);
          // refresh 실패 시 로그아웃 처리
          await handleRefreshFailure();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 이미 재발급 중인 경우 대기
        console.log("⏳ 토큰 재발급 진행 중 - 요청 대기 중...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ 
            resolve: (token) => {
              console.log("✅ 대기 중인 요청 재시도");
              resolve(retryRequest(originalRequest, token));
            }, 
            reject 
          });
        });
      }
    }

    // 403 에러 처리 (기존 로직 유지)
    if (status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const headerToken = extractTokenFromHeaders(error.response?.headers);
      if (headerToken) {
        console.log("🔐 403 에러 - 헤더에서 새 토큰 발견, 요청 재시도");
        saveTokens(headerToken);
        return retryRequest(originalRequest, headerToken).catch(err => {
          console.error("❌ 재시도 요청 실패:", err);
          return Promise.reject(err);
        });
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