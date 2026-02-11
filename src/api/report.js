import client from "./client";

// 원하는 형식에 맞게 reporterId 제거 (백엔드에서 자동 처리 또는 헤더에서 가져옴)
export const postReport = async (postType, postId, title, reportedMemberId, selectedReasons, description) => {
  try {
    const requestBody = {
      postType,
      postId: Number(postId),
      title,
      reportedMemberId: Number(reportedMemberId),
      reasons: selectedReasons,
      description,
    };
    

    const response = await client.post("/api/v1/report", requestBody);
    return response.data;
  } catch (error) {
    console.error("신고 생성 에러:", error);
    throw error;
  }
};