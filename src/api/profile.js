import client from "./client";

export const getProfile = async (
  firstCategory,
  secondCategory,
  thirdCategory,
  keyword,
  pageable
) => {
  try {
    // 조건부로 params 객체 구성
    const params = {
      page: pageable.page,
      size: pageable.size,
      ...(firstCategory ? { firstCategory } : {}),
      ...(secondCategory ? { secondCategory } : {}),
      ...(thirdCategory ? { thirdCategory } : {}),
      ...(keyword ? { keyword } : {}),
    };

    const response = await client.get("/api/v1/member", { params });
    return response.data;
  } catch (error) {
    console.error("프로필 조회 에러:", error);
    throw error;
  }
};





export const getProfileDetail = async (memberId) => {
  try {
    const response = await client.get(`/api/v1/feed/${memberId}`);
    return response.data;
  } catch (error) {
    console.error("인기 피드 조회 에러:", error);
    throw error;
  }
};