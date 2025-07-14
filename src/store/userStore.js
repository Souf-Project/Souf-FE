import { create } from "zustand";
import { persist } from "zustand/middleware";

export const UserStore = create(
  persist(
    (set, get) => ({
      memberId: null,
      nickname: null,
      roleType: null,
      accessToken: null,

      setUser: ({ memberId, nickname, roleType }) =>
        set({ memberId, nickname, roleType }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      updateAccessToken: (accessToken) =>
        set({ accessToken }),

      clearUser: () => set({ 
        memberId: null, 
        nickname: null, 
        roleType: null,
        accessToken: null
      }),

      // 토큰이 유효한지 확인
      isTokenValid: () => {
        const { accessToken } = get();
        return !!accessToken;
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
