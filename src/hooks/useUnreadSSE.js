import { useEffect } from 'react';
import useUnreadStore from '../store/useUnreadStore';

const useUnreadSSE = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const setUnreadCount = useUnreadStore((state) => state.setUnreadCount);
  const addNotification = useUnreadStore((state) => state.addNotification);

  useEffect(() => {
    // 단방향 구독만 함
    const eventSource = new EventSource(`${BASE_URL}/api/v1/notifications/subscribe`, {
      withCredentials: false,
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // 서버가 보낸 내용에 따라 갱신
        if (data.unreadCount !== undefined) {
          setUnreadCount(data.unreadCount);
        }

        if (data.notification) {
          addNotification(data.notification);
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
    };

    return () => {
      eventSource.close();
    };
  }, [BASE_URL, setUnreadCount, addNotification]);
};

export default useUnreadSSE;
