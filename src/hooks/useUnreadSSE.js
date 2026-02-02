import { useEffect, useRef } from 'react';
import useUnreadStore from '../store/useUnreadStore';
import { refreshAccessToken, getIsRefreshing, getRefreshPromise } from '../api/client';

const useUnreadSSE = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const setUnreadChatCount = useUnreadStore((state) => state.setUnreadChatCount);
  const setUnreadNotificationCount = useUnreadStore((state) => state.setUnreadNotificationCount);
  const addNotification = useUnreadStore((state) => state.addNotification);
  const setNotifications = useUnreadStore((state) => state.setNotifications);
  const eventSourceRef = useRef(null);
  const isReconnectingRef = useRef(false);

  const createEventSource = async (token) => {
    // 리프레시 토큰 재발급 중이면 대기
    const waitForRefreshIfNeeded = async () => {
      let attempts = 0;
      const maxAttempts = 200; // 200 * 10ms = 2초
      
      while ((getIsRefreshing() || getRefreshPromise()) && attempts < maxAttempts) {
        // console.log('[SSE] 리프레시 토큰 재발급 중 - SSE 연결 대기...', {
        //   isRefreshing: getIsRefreshing(),
        //   hasRefreshPromise: !!getRefreshPromise(),
        //   attempts
        // });
        await new Promise(resolve => setTimeout(resolve, 10));
        attempts++;
      }
      
      // refreshPromise가 있으면 완료까지 대기
      const refreshPromise = getRefreshPromise();
      if (refreshPromise) {
        try {
          // console.log('[SSE] refreshPromise 대기 중...');
          const newAccessToken = await refreshPromise;
          // console.log('[SSE] 새 토큰 받음, SSE 연결 생성:', {
          //   tokenLength: newAccessToken?.length
          // });
          return newAccessToken;
        } catch (error) {
          // console.error('[SSE] 리프레시 실패:', error);
          throw error;
        }
      }
      
      return token;
    };
    
    // 리프레시 중이면 대기하고 새 토큰 사용
    const finalToken = await waitForRefreshIfNeeded();
    
    // 기존 연결이 있으면 닫기
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // EventSource는 헤더를 설정할 수 없으므로 쿼리 파라미터로 토큰 전달
    const eventSource = new EventSource(
      `${BASE_URL}/api/v1/notifications/subscribe?token=${encodeURIComponent(finalToken)}`,
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
        // console.error('SSE parse error:', err);
      }
    };

    eventSource.onerror = async (err) => {
      // console.error('SSE connection error:', err);
      
      // 연결이 종료되었고, 재연결 중이 아닐 때만 처리
      if (eventSource.readyState === EventSource.CLOSED && !isReconnectingRef.current) {
        // console.log('SSE 연결이 종료되었습니다. 토큰 재발급 시도...');
        
        // 재연결 플래그 설정 (중복 재연결 방지)
        isReconnectingRef.current = true;
        
        try {
          // 리프레시 토큰 발급
          const newAccessToken = await refreshAccessToken();
          // console.log('토큰 재발급 성공. SSE 재연결 시도...');
          
          // 새 토큰으로 재연결 (리프레시 중이면 자동으로 대기)
          eventSourceRef.current = await createEventSource(newAccessToken);
          isReconnectingRef.current = false;
        } catch (refreshError) {
          // console.error('토큰 재발급 실패:', refreshError);
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
    
    // SSE 연결 생성 (리프레시 중이면 자동으로 대기)
    createEventSource(accessToken)
      .then((eventSource) => {
        if (eventSource) {
          eventSourceRef.current = eventSource;
        }
      })
      .catch((error) => {
        // console.error('[SSE] 연결 생성 실패:', error);
      });

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
