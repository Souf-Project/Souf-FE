import { create } from "zustand";
import { persist } from "zustand/middleware";

export const UserStore = create(
  persist(
    (set) => ({
      memberId: null,
      nickname: null,
      roleType: null,

      setUser: ({ memberId, nickname, roleType }) =>
        set({ memberId, nickname, roleType }),

      clearUser: () => set({ memberId: null, nickname: null, roleType: null }),
    }),
    {
      name: "user-storage", // localStorage에 저장될 key 이름
      partialize: (state) => ({
        memberId: state.memberId,
        nickname: state.nickname,
        roleType: state.roleType,
      }), // 저장할 필드만 선택
    }
  )
);
