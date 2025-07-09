import client from "./client";

export const getProfile = async (firstCategory, pageable) => {
  try {
    const response = await client.get("/api/v1/member", {
      params: {
        firstCategory,
        page: pageable.page,
        size: pageable.size,
      },
    });
    return response.data;
  } catch (error) {
    console.error("인기 피드 조회 에러:", error);
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