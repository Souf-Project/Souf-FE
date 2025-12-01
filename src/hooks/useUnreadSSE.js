import { useEffect } from 'react';
import useUnreadStore from '../store/useUnreadStore';

const useUnreadSSE = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const setUnreadCount = useUnreadStore((state) => state.setUnreadCount);
  const addNotification = useUnreadStore((state) => state.addNotification);

  useEffect(() => {
    // accessToken 가져오기
    const accessToken = localStorage.getItem("accessToken");
    
    // 토큰이 없으면 SSE 연결하지 않음
    if (!accessToken) {
      console.log("⚠️ SSE 연결 실패: accessToken이 없습니다.");
      return;
    }
    
    // EventSource는 헤더를 설정할 수 없으므로 쿼리 파라미터로 토큰 전달
    const eventSource = new EventSource(
      `${BASE_URL}/api/v1/notifications/subscribe?token=${encodeURIComponent(accessToken)}`,
      {
        withCredentials: true,
      }
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // 서버가 보낸 내용에 따라 갱신
        if (data.unreadCount !== undefined) {
          setUnreadCount(data.unreadCount);
        }

        if (data.notification) {
          addNotification(data.notification);
          console.log(data.notification);
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    eventSource.onopen = () => {
      console.log('✅ SSE 연결 성공');
    };

    eventSource.onerror = (err) => {
      console.error('❌ SSE connection error:', err);
      // 401 에러인 경우 토큰 문제일 수 있음
      if (eventSource.readyState === EventSource.CLOSED) {
        console.error('SSE 연결이 종료되었습니다. 토큰을 확인해주세요.');
      }
    };

    return () => {
      eventSource.close();
      console.log('SSE 연결 종료');
    };
  }, [BASE_URL, setUnreadCount, addNotification]);
};

export default useUnreadSSE;
