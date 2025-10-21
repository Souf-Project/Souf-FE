import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUnreadNotificationCount, getNotifications } from "../api/notification";

export const UserStore = create(
  persist(
    (set, get) => ({
      memberId: null,
      nickname: null,
      roleType: null,
      accessToken: null,

      setUser: ({ memberId, nickname, roleType }) => {
        set({ memberId, nickname, roleType });
      },

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      updateAccessToken: (accessToken) => {
        set({ accessToken });
      },

      clearUser: () => {
        set({ 
          memberId: null, 
          nickname: null, 
          roleType: null,
          accessToken: null
        });
      },

      // 토큰이 유효한지 확인
      isTokenValid: () => {
        const { accessToken } = get();
        return !!accessToken;
      },

      // 로그인 상태인지 확인
      isLoggedIn: () => {
        const { memberId, accessToken } = get();
        return !!(memberId && accessToken);
      },

      // 사용자 정보 가져오기
      getUserInfo: () => {
        const { memberId, nickname, roleType } = get();
        return { memberId, nickname, roleType };
      },

      // 토큰 가져오기
      getAccessToken: () => {
        const { accessToken } = get();
        return accessToken;
      },

      // 로그아웃 시 모든 데이터 정리
      logout: () => {
        localStorage.removeItem("accessToken");
        set({ 
          memberId: null, 
          nickname: null, 
          roleType: null,
          accessToken: null
        });
      },

      // 알림 초기화 (로그인 시 호출)
      initializeNotifications: async () => {
        try {
          const unreadCountResponse = await getUnreadNotificationCount();
          const notificationsResponse = await getNotifications(0, 20);
          
          // 알림 store에 데이터 설정 (외부에서 호출)
          return {
            unreadCount: unreadCountResponse.result || 0,
            notifications: notificationsResponse.result || []
          };
        } catch (error) {
          console.error('알림 초기화 에러:', error);
          return {
            unreadCount: 0,
            notifications: []
          };
        }
      },
    }),
    {
      name: "user-storage", // localStorage에 저장될 key 이름
      partialize: (state) => ({
        memberId: state.memberId,
        nickname: state.nickname,
        roleType: state.roleType,
        accessToken: state.accessToken,
      }), // 저장할 필드만 선택
    }
  )
);
