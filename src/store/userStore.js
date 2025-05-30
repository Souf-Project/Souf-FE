import { create } from "zustand";

export const UserStore = create((set) => ({
  accessToken: null,
  memberId: null,
  username: null,
  roleType: null,

  setUser: ({ accessToken, memberId, username, roleType }) =>
    set({
      accessToken,
      memberId,
      username,
      roleType,
    }),

  clearUser: () =>
    set({
      accessToken: null,
      memberId: null,
      username: null,
      roleType: null,
    }),
}));
