import { create } from "zustand";
import { persist } from "zustand/middleware";

export const UserStore = create(
  persist(
    (set) => ({
      memberId: null,
      username: null,
      roleType: null,

      setUser: ({ memberId, username, roleType }) =>
        set({ memberId, username, roleType }),

      clearUser: () => set({ memberId: null, username: null, roleType: null }),
    }),
    {
      name: "user-storage", // localStorage에 저장될 key 이름
      partialize: (state) => ({
        memberId: state.memberId,
        username: state.username,
        roleType: state.roleType,
      }), // 저장할 필드만 선택
    }
  )
);
