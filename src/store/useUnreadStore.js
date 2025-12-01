import { create } from 'zustand';

const useUnreadStore = create((set) => ({
  // 읽지 않은 채팅 개수
  unreadChatCount: 0,
  
  // 읽지 않은 알림 개수
  unreadNotificationCount: 0,
  
  // 알림 목록
  notifications: [],
  
  // 읽지 않은 채팅 개수 설정
  setUnreadChatCount: (count) => set({ unreadChatCount: count }),
  
  // 읽지 않은 알림 개수 설정
  setUnreadNotificationCount: (count) => set({ unreadNotificationCount: count }),
  
  // 알림 목록 설정 (알림 목록에서 읽지 않은 개수 자동 계산)
  setNotifications: (notifications) => set((state) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    return { 
      notifications,
      unreadNotificationCount: unreadCount
    };
  }),
  
  // 새 알림 추가
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadNotificationCount: state.unreadNotificationCount + 1
  })),
  
  // 알림 읽음 처리
  markAsRead: (notificationId) => set((state) => {
    const updatedNotifications = state.notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    return {
      notifications: updatedNotifications,
      unreadNotificationCount: unreadCount
    };
  }),
  
  // 모든 알림 읽음 처리
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(notification => ({
      ...notification,
      isRead: true
    })),
    unreadNotificationCount: 0
  }))
}));

export default useUnreadStore;
