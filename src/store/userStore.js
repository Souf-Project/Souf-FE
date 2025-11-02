import { create } from "zustand";
import { persist } from "zustand/middleware";

export const UserStore = create(
  persist(
    (set, get) => ({
      memberId: null,
      nickname: null,
      roleType: null,
      accessToken: null,
      approvedStatus: null,

      setUser: ({ memberId, nickname, roleType, approvedStatus }) => {
        set({ memberId, nickname, roleType, approvedStatus });
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
          accessToken: null,
          approvedStatus: null,
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
          accessToken: null,
          approvedStatus: null,
        });
      },
    }),
    {
      name: "user-storage", // localStorage에 저장될 key 이름
      partialize: (state) => ({
        memberId: state.memberId,
        nickname: state.nickname,
        roleType: state.roleType,
        accessToken: state.accessToken,
        approvedStatus: state.approvedStatus,
      }), // 저장할 필드만 선택
    }
  )
);
