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

// 리프레시 상태 확인을 위한 export
export const getIsRefreshing = () => isRefreshing;
export const getRefreshPromise = () => refreshPromise;

const processQueue = (error, token = null) => {
  const queueLength = failedQueue.length;
  // console.log(`[리프레시 토큰] 대기 중인 요청 처리 시작: ${queueLength}개 요청`, {
  //   hasError: !!error,
  //   hasToken: !!token
  // });
  
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  
  failedQueue = [];
  // console.log(`[리프레시 토큰] 대기 중인 요청 처리 완료`);
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

// 토큰 저장 (accessToken만 저장, refreshToken은 HttpOnly 쿠키로 서버가 관리)
const saveTokens = (accessToken) => {
  // console.log("[리프레시 토큰] saveTokens 호출 - 새 accessToken 저장:", {
  //   tokenLength: accessToken?.length,
  //   tokenPreview: accessToken?.substring(0, 50) + "..."
  // });
  UserStore.getState().updateAccessToken(accessToken);
  localStorage.setItem("accessToken", accessToken);
  // console.log("[리프레시 토큰] localStorage에 accessToken 저장 완료");
  
  // refreshToken은 HttpOnly 쿠키로 서버가 관리하므로 클라이언트에서 저장할 필요 없음
};

// 쿠키 삭제 헬퍼 함수
const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
};

// 강제 로그아웃 처리 (refresh 실패 시)
const handleRefreshFailure = async (message = "로그인 시간이 만료되었습니다. 재로그인해주세요") => {
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
      // console.warn("로그아웃 API 응답 코드:", logoutResponse.status);
    }
  } catch (logoutError) {
    // 로그아웃 API 실패해도 클라이언트 토큰은 정리
    // console.error("로그아웃 API 호출 실패:", logoutError);
  } finally {
    // 2. 클라이언트에서 토큰 정리
    UserStore.getState().logout();
    localStorage.removeItem("accessToken");
    // refreshToken은 HttpOnly 쿠키로 서버가 관리하므로 클라이언트에서 삭제 불가
    // 서버의 로그아웃 API 호출로 쿠키가 삭제됨
    
    // 4. 로그인 만료 모달 표시를 위한 커스텀 이벤트 발생
    const event = new CustomEvent('showSessionExpiredModal', {
      detail: {
        message: message
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

// 리프레시 토큰 재발급 Promise 저장 (중복 호출 방지)
let refreshPromise = null;

// 토큰 재발급 API 호출
export const refreshAccessToken = async () => {
  // 이미 리프레시 진행 중이면 기존 Promise 반환
  if (isRefreshing && refreshPromise) {
    // console.log("[리프레시 토큰] 이미 리프레시 진행 중 - 기존 Promise 반환");
    return refreshPromise;
  }
  
  // 리프레시 플래그를 즉시 설정 (다른 요청들이 대기하도록)
  // 이 시점부터 모든 요청이 대기해야 함
  isRefreshing = true;
  // console.log("[리프레시 토큰] isRefreshing 플래그 설정 완료 - 모든 요청 대기 시작");
  
  // console.log("[리프레시 토큰] 토큰 재발급 시도 시작", {
  //   isRefreshing,
  //   hasRefreshPromise: !!refreshPromise
  // });
  
  // Promise 생성 및 저장
  refreshPromise = (async () => {
    try {
      // HttpOnly 쿠키로 refreshToken이 관리되므로 JS에서 읽을 수 없음
      // withCredentials: true로 쿠키가 자동으로 전송됨
      const response = await axios.post(
        `${SERVER_URL}/api/v1/auth/refresh`,
        {},
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      
      // console.log("[리프레시 토큰] API 응답 성공:", {
      //   status: response.status,
      //   statusText: response.statusText,
      //   headers: response.headers,
      //   data: response.data
      // });
      
      const newAccessToken = extractTokenFromResponse(response);
      if (!newAccessToken) {
        // console.error("[리프레시 토큰] 응답에 새 토큰이 없습니다:", response);
        throw new Error("토큰 재발급 응답에 새 토큰이 없습니다");
      }
      
      // console.log("[리프레시 토큰] 새 accessToken 추출 성공:", {
      //   tokenLength: newAccessToken.length,
      //   tokenPreview: newAccessToken.substring(0, 50) + "..."
      // });
    
      // refreshToken은 HttpOnly 쿠키로 서버가 관리하므로 클라이언트에서 저장할 필요 없음
      // 새 accessToken만 저장
      saveTokens(newAccessToken);
      // console.log("[리프레시 토큰] 토큰 재발급 완료");
      
      return newAccessToken;
    } catch (error) {
      // console.error("[리프레시 토큰] API 호출 실패:", {
      //   message: error.message,
      //   response: error.response?.data,
      //   status: error.response?.status,
      //   statusText: error.response?.statusText,
      //   headers: error.response?.headers
      // });
      
      // 403 에러인 경우 (refresh token이 만료되었거나 유효하지 않음)
      if (error.response?.status === 403) {
        // console.log("[리프레시 토큰] 403 에러 발생 - 재로그인 필요");
        await handleRefreshFailure("재로그인이 필요합니다");
      }
      
      throw error;
    } finally {
      // 리프레시 완료 후 플래그 및 Promise 초기화
      isRefreshing = false;
      refreshPromise = null;
      // console.log("[리프레시 토큰] 리프레시 프로세스 완료 - 플래그 초기화");
    }
  })();
  
  return refreshPromise;
};


// 요청 인터셉터 추가
client.interceptors.request.use(
  async (config) => {
    const requestUrl = config.url || '';
    const requestMethod = config.method?.toUpperCase() || 'UNKNOWN';
    
    // refresh API 자체는 대기하지 않음
    // HttpOnly 쿠키로 refreshToken이 자동 전송되므로 헤더 설정 불필요
    if (requestUrl.includes('/api/v1/auth/refresh')) {
      return config;
    }
    
    // 재요청인 경우 (_skipTokenInterceptor 플래그가 있으면) 헤더가 이미 설정되어 있으므로 건너뜀
    if (config._skipTokenInterceptor) {
      // console.log("[리프레시 토큰] 재요청 - 헤더 설정 건너뜀:", {
      //   url: requestUrl,
      //   method: requestMethod,
      //   hasAuthHeader: !!config.headers?.Authorization
      // });
      return config;
    }
    
    // 리프레시 토큰 재발급 중이면 refreshPromise를 기다림
    // refresh API 자체는 제외 (이미 위에서 처리됨)
    if (refreshPromise) {
      try {
        // refreshPromise가 완료될 때까지 대기하고 새 토큰으로 헤더 설정
        const newAccessToken = await refreshPromise;
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        };
        // console.log("[리프레시 토큰] refreshPromise 대기 완료 - 새 토큰으로 헤더 설정:", {
        //   url: requestUrl,
        //   method: requestMethod,
        //   tokenLength: newAccessToken?.length
        // });
        return config;
      } catch (error) {
        // 리프레시 실패 시 요청도 실패
        throw error;
      }
    }
    
    // 리프레시 진행 중이 아니면 기존 로직대로 진행
    // 항상 localStorage에서 최신 토큰을 가져와서 사용
    const accessToken = localStorage.getItem("accessToken");
    
    if (accessToken) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      };
      // console.log("[리프레시 토큰] 일반 요청 - localStorage에서 토큰 사용:", {
      //   url: requestUrl,
      //   method: requestMethod,
      //   tokenLength: accessToken.length
      // });
    } else {
      // console.warn("[리프레시 토큰] accessToken이 없음:", {
      //   url: requestUrl,
      //   method: requestMethod
      // });
    }
    
    return config;
  },
  (error) => {
    // console.error("요청 인터셉터 에러:", error);
    return Promise.reject(error);
  }
);
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const errorKey = error.response?.data?.errorKey;
    const requestUrl = originalRequest?.url || originalRequest?._fullUrl || '';
    const requestMethod = originalRequest?.method?.toUpperCase() || 'UNKNOWN';
      
    // refresh API 호출 자체가 실패한 경우 (RT가 유효하지 않음)
    if (requestUrl.includes('/api/v1/auth/refresh')) {
      // console.error("[API 에러] 리프레시 토큰 API 호출 실패:", {
      //   status,
      //   errorKey,
      //   response: error.response?.data
      // });
      await handleRefreshFailure();
      return Promise.reject(error);
    }

    // 토큰 만료 에러 처리 (401 또는 400 + S400-6)
    // 토큰이 있는 경우에만 refresh 시도 (로그인 없이 조회 가능한 API는 토큰이 없을 수 있음)
    const isTokenExpired = (status === 401) || (status === 400 && errorKey === 'S400-6');
    
    if (isTokenExpired && !originalRequest._retry) {
      // console.log("[API 에러] 토큰 만료 감지:", {
      //   method: requestMethod,
      //   url: requestUrl,
      //   status,
      //   errorKey,
      //   response: error.response?.data
      // });
      
      const accessToken = localStorage.getItem("accessToken");
      
      // refreshToken은 HttpOnly 쿠키로 관리되므로 JS에서 확인 불가
      // accessToken이 없으면 리프레시 시도하지 않음 (로그인하지 않은 사용자)
      if (!accessToken) {
        // console.log("[리프레시 토큰] accessToken이 없어 리프레시 시도하지 않음");
        return Promise.reject(error);
      }

      // refreshPromise가 이미 존재하면 대기열에 추가
      if (refreshPromise) {
        // console.log("[리프레시 토큰] 이미 리프레시 진행 중 - 요청을 대기열에 추가:", {
        //   url: requestUrl,
        //   method: requestMethod,
        //   currentQueueLength: failedQueue.length
        // });
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, originalRequest });
          // console.log("[리프레시 토큰] 대기열에 추가 완료. 현재 대기 중인 요청 수:", failedQueue.length);
        })
          .then(token => {
            // console.log("[리프레시 토큰] 대기 중인 요청 재시도:", {
            //   url: requestUrl,
            //   method: requestMethod
            // });
            originalRequest._retry = true;
            originalRequest._skipTokenInterceptor = true; // 요청 인터셉터에서 토큰 설정 건너뛰기
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${token}`,
            };
            return client(originalRequest);
          })
          .catch(err => {
            // console.error("[리프레시 토큰] 대기 중인 요청 재시도 실패:", {
            //   url: requestUrl,
            //   method: requestMethod,
            //   error: err
            // });
            return Promise.reject(err);
          });
      }

      // console.log("[리프레시 토큰] 리프레시 토큰 재발급 시작:", {
      //   url: requestUrl,
      //   method: requestMethod,
      //   isRefreshing: isRefreshing
      // });
      
      originalRequest._retry = true;
      // 원래 요청을 추적하기 위해 원래 요청 정보 저장
      const originalRequestInfo = {
        url: requestUrl,
        method: requestMethod,
        originalRequest
      };
      
      // isRefreshing은 refreshAccessToken 내부에서 관리하므로 여기서는 설정하지 않음

      try {
        const newAccessToken = await refreshAccessToken();
        
        // console.log("[리프레시 토큰] 재발급 성공 - 대기 중인 요청 처리 및 원래 요청 재시도:", {
        //   url: requestUrl,
        //   method: requestMethod,
        //   queueLength: failedQueue.length
        // });
        
        // 대기 중인 요청들 처리 (원래 요청과 동일한 요청 제외)
        const remainingQueue = [];
        failedQueue.forEach(item => {
          const itemUrl = item.originalRequest?.url || item.originalRequest?._fullUrl || '';
          const itemMethod = item.originalRequest?.method?.toUpperCase() || '';
          const isOriginalRequest = itemUrl === originalRequestInfo.url && itemMethod === originalRequestInfo.method;
          
          if (isOriginalRequest) {
            // 원래 요청과 동일한 요청은 대기열에서 제거 (원래 요청이 별도로 재시도되므로)
            // console.log("[리프레시 토큰] 원래 요청과 동일한 요청을 대기열에서 제거:", {
            //   url: itemUrl,
            //   method: itemMethod
            // });
          } else {
            // 다른 요청들은 처리
            item.resolve(newAccessToken);
          }
        });
        
        // 대기열 초기화
        failedQueue = [];
        
        // 새 토큰으로 원래 요청 재시도
        // _retry 플래그를 설정하여 요청 인터셉터에서 헤더를 덮어쓰지 않도록 함
        originalRequest._retry = true;
        originalRequest._skipTokenInterceptor = true; // 요청 인터셉터에서 토큰 설정 건너뛰기
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        };
        // console.log("[리프레시 토큰] 원래 요청 재시도:", {
        //   url: requestUrl,
        //   method: requestMethod,
        //   tokenLength: newAccessToken.length
        // });
        return client(originalRequest);
      } catch (refreshError) {
        // console.error("[리프레시 토큰] 재발급 실패:", {
        //   url: requestUrl,
        //   method: requestMethod,
        //   error: refreshError,
        //   queueLength: failedQueue.length
        // });
        
        // refresh 실패 시 대기 중인 요청들 모두 실패 처리
        processQueue(refreshError, null);
        // isRefreshing은 refreshAccessToken 내부에서 관리하므로 여기서는 초기화하지 않음
        
        // refresh 실패 시 로그아웃 처리
        await handleRefreshFailure();
        return Promise.reject(refreshError);
      }
    }

 // 리프레시 토큰 요청 후에 발생하는 에러 키 
 // G403 = 로그인 해주세요
    if (status === 403 && errorKey === 'G403') {
      // console.log("[API 에러] G403 에러 발생 - 로그인 필요:", {
      //   url: requestUrl,
      //   method: requestMethod,
      //   response: error.response?.data
      // });
      await handleRefreshFailure("다시 로그인해주세요");
      return Promise.reject(error);
    }

    // 일반 API 에러 로그 (토큰 만료가 아닌 경우)
    if (!isTokenExpired || originalRequest._retry) {
      // console.error("[API 에러] 일반 API 에러:", {
      //   method: requestMethod,
      //   url: requestUrl,
      //   status,
      //   errorKey,
      //   response: error.response?.data,
      //   message: error.message
      // });
    }

    // 네트워크 에러 처리
    if (error.code === "ERR_NETWORK") {
      // console.error("[API 에러] 서버 연결 실패:", {
      //   url: requestUrl,
      //   method: requestMethod,
      //   code: error.code
      // });
    }

    return Promise.reject(error);
  }
);

export default client;