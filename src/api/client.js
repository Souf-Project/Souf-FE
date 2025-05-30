import axios from "axios";

// VITE 버전으로 url 연결
const serverUrl = import.meta.env.VITE_BASE_URL;

const client = axios.create({
    baseURL: serverUrl,
});

// 요청 인터셉터 추가
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
        if (error.response?.status === 403) {
            // 토큰이 만료되었거나 유효하지 않은 경우
            localStorage.removeItem('token');
            localStorage.removeItem('isLogin');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default client;
