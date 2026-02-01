import { useEffect, useRef } from 'react';
import useUnreadStore from '../store/useUnreadStore';
import { refreshAccessToken } from '../api/client';

const useUnreadSSE = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const setUnreadChatCount = useUnreadStore((state) => state.setUnreadChatCount);
  const setUnreadNotificationCount = useUnreadStore((state) => state.setUnreadNotificationCount);
  const addNotification = useUnreadStore((state) => state.addNotification);
  const setNotifications = useUnreadStore((state) => state.setNotifications);
  const eventSourceRef = useRef(null);
  const isReconnectingRef = useRef(false);

  const createEventSource = (token) => {
    // 기존 연결이 있으면 닫기
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // EventSource는 헤더를 설정할 수 없으므로 쿼리 파라미터로 토큰 전달
    const eventSource = new EventSource(
      `${BASE_URL}/api/v1/notifications/subscribe?token=${encodeURIComponent(token)}`,
      {
        withCredentials: true,
      }
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // console.log('SSE 메시지 수신:', data);

        // 읽지 않은 채팅 개수 업데이트
        if (data.unreadChatCount !== undefined) {
          setUnreadChatCount(data.unreadChatCount);
          // console.log('채팅 개수 업데이트:', data.unreadChatCount);
        }

        // 읽지 않은 알림 개수 업데이트
        if (data.unreadNotificationCount !== undefined) {
          setUnreadNotificationCount(data.unreadNotificationCount);
          // console.log('알림 개수 업데이트:', data.unreadNotificationCount);
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
          // console.log('초기 알림 목록 저장:', normalizedNotifications.length, '개');
        }

        // 새 알림 (단일 객체로 받는 경우)
        if (data.notification && !Array.isArray(data.notification)) {
          const normalizedNotification = {
            ...data.notification,
            isRead: data.notification.read !== undefined ? data.notification.read : data.notification.isRead
          };
          addNotification(normalizedNotification);
          // console.log('새 알림 추가:', normalizedNotification);
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    eventSource.onerror = async (err) => {
      console.error('SSE connection error:', err);
      
      // 연결이 종료되었고, 재연결 중이 아닐 때만 처리
      if (eventSource.readyState === EventSource.CLOSED && !isReconnectingRef.current) {
        console.log('SSE 연결이 종료되었습니다. 토큰 재발급 시도...');
        
        // 재연결 플래그 설정 (중복 재연결 방지)
        isReconnectingRef.current = true;
        
        try {
          // 리프레시 토큰 발급
          const newAccessToken = await refreshAccessToken();
          console.log('토큰 재발급 성공. SSE 재연결 시도...');
          
          // 새 토큰으로 재연결
          eventSourceRef.current = createEventSource(newAccessToken);
          isReconnectingRef.current = false;
        } catch (refreshError) {
          console.error('토큰 재발급 실패:', refreshError);
          isReconnectingRef.current = false;
          // 토큰 재발급 실패 시 연결 종료
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
        }
      }
    };

    eventSourceRef.current = eventSource;
    return eventSource;
  };

  useEffect(() => {
    // accessToken 가져오기
    const accessToken = localStorage.getItem("accessToken");
    
    // 토큰이 없으면 SSE 연결하지 않음
    if (!accessToken) {
      // console.log("SSE 연결 실패- accessToken 없음");
      return;
    }
    
    // SSE 연결 생성
    createEventSource(accessToken);

    return () => {
      // 컴포넌트 언마운트 시 연결 종료
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      isReconnectingRef.current = false;
      // console.log('SSE 연결 종료');
    };
  }, [BASE_URL, setUnreadChatCount, setUnreadNotificationCount, addNotification, setNotifications]);
};

export default useUnreadSSE;
