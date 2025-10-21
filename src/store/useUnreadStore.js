import { create } from 'zustand';

const useUnreadStore = create((set) => ({
  // 읽지 않은 알림 개수
  unreadCount: 0,
  
  // 알림 목록
  notifications: [],
  
  // 읽지 않은 알림 개수 설정
  setUnreadCount: (count) => set({ unreadCount: count }),
  
  // 알림 개수 증가
  incrementUnreadCount: () => set((state) => ({ 
    unreadCount: state.unreadCount + 1 
  })),
  
  // 알림 개수 감소
  decrementUnreadCount: () => set((state) => ({ 
    unreadCount: Math.max(0, state.unreadCount - 1) 
  })),
  
  // 알림 개수 초기화
  resetUnreadCount: () => set({ unreadCount: 0 }),
  
  // 알림 목록 설정
  setNotifications: (notifications) => set({ notifications }),
  
  // 새 알림 추가
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1
  })),
  
  // 알림 읽음 처리
  markAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),
  
  // 모든 알림 읽음 처리
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(notification => ({
      ...notification,
      isRead: true
    })),
    unreadCount: 0
  }))
}));

export default useUnreadStore;
