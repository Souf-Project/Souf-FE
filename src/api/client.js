import axios from "axios";

const SERVER_URL = import.meta.env.VITE_BASE_URL;

const client = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
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
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("서버 연결 실패");
    }
    return Promise.reject(error);
  }
);

export default client;


client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      if (error.response.data.message === "토큰 재발급이 필요합니다.") {
        const originalRequest = error.config;
        try {

          if (tokenResponse.status === 201) {
            const newAccessToken = tokenResponse.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          if (axios.isAxiosError(refreshError)) {
            alert("로그인이 필요합니다.");
            window.location.replace("/");
          }
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);