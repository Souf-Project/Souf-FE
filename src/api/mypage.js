import client from "./client";
import { UserStore } from "../store/userStore";

/* 프로필 조회 */
export async function getProfile() {
//   const accessToken = UserStore.getState().accessToken;
const accessToken = localStorage.getItem("accessToken");
const response = await client.get("/api/v1/member/myinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
}

/* 프로필 수정 */
export async function putProfileEdit(data) {
 //   const accessToken = UserStore.getState().accessToken;
const accessToken = localStorage.getItem("accessToken");
  const response = await client.put("/api/v1/member/update", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response;
}
