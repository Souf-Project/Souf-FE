import client from "./client";

export const getSearchDetail = async (keyword, page = 0, size = 20) => {
  try {
    const response = await client.get(`/api/v1/search`, {
      params: {
        keyword : keyword,
        page : page,
        size : size,
      },
    });
    return response;
  } catch (error) {
    console.error("통합 검색 에러:", error);
    throw error;
  }
};