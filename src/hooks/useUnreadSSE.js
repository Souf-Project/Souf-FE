import { useEffect } from 'react';
import useUnreadStore from '../store/useUnreadStore';

const useUnreadSSE = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const setUnreadChatCount = useUnreadStore((state) => state.setUnreadChatCount);
  const setUnreadNotificationCount = useUnreadStore((state) => state.setUnreadNotificationCount);
  const addNotification = useUnreadStore((state) => state.addNotification);
  const setNotifications = useUnreadStore((state) => state.setNotifications);

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

    eventSource.addEventListener = (event) => {
      
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 SSE 메시지 수신:', data);

        // 읽지 않은 채팅 개수 업데이트
        if (data.unreadChatCount !== undefined) {
          setUnreadChatCount(data.unreadChatCount);
          console.log('✅ 채팅 개수 업데이트:', data.unreadChatCount);
        }

        // 읽지 않은 알림 개수 업데이트
        if (data.unreadNotificationCount !== undefined) {
          setUnreadNotificationCount(data.unreadNotificationCount);
          console.log('✅ 알림 개수 업데이트:', data.unreadNotificationCount);
        }

        // 기존 unreadCount 필드 지원 (하위 호환성)
        if (data.unreadCount !== undefined && data.unreadChatCount === undefined && data.unreadNotificationCount === undefined) {
          setUnreadNotificationCount(data.unreadCount);
        }

        // 초기 알림 목록 (배열로 받는 경우)
        if (Array.isArray(data.notifications)) {
          const normalizedNotifications = data.notifications.map(notification => ({
            ...notification,
            isRead: notification.read !== undefined ? notification.read : notification.isRead
          }));
          setNotifications(normalizedNotifications);
          console.log('✅ 초기 알림 목록 저장:', normalizedNotifications.length, '개');
        }

        // 새 알림 (단일 객체로 받는 경우)
        if (data.notification && !Array.isArray(data.notification)) {
          const normalizedNotification = {
            ...data.notification,
            isRead: data.notification.read !== undefined ? data.notification.read : data.notification.isRead
          };
          addNotification(normalizedNotification);
          console.log('✅ 새 알림 추가:', normalizedNotification);
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

   

    eventSource.onopen = () => {
      console.log('✅ SSE 연결 성공');
      console.log('✅ SSE 연결 성공', eventSource);
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
  }, [BASE_URL, setUnreadChatCount, setUnreadNotificationCount, addNotification, setNotifications]);
};

export default useUnreadSSE;
