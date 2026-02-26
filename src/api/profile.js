import client from "./client";

export const getProfile = async (
  firstCategory,
  secondCategory,
  pageable
) => {
  try {
    // 조건부로 params 객체 구성
    const params = {
      page: pageable.page,
      size: pageable.size,
      ...(firstCategory ? { firstCategory } : {}),
      ...(secondCategory ? { secondCategory } : {}),
    };

    const response = await client.get("/api/v1/member", { params });
    return response.data;
  } catch (error) {
    console.error("프로필 조회 에러:", error);
    throw error;
  }
};





export const getProfileDetail = async (memberId, pageable = { page: 0, size: 12, sort: [] }) => {
  try {
    const params = {
      page: pageable.page,
      size: pageable.size,
      ...(pageable.sort && pageable.sort.length > 0 ? { sort: pageable.sort } : {}),
    };
    const response = await client.get(`/api/v1/feed/${memberId}`, { params });
    return response.data;
  } catch (error) {
    console.error("인기 피드 조회 에러:", error);
    throw error;
  }
};