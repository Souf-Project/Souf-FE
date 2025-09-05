import client from "./client";

       
export const postReport = async (postType, postId, title, reporterId, reportedMemberId, selectedReasons, description) => {
  try {
    const response = await client.post("/api/v1/report", {
       postType,
       postId,
       title,
       reporterId,
       reportedMemberId,
       reasons : selectedReasons,
       description,
    });
    return response.data;
  } catch (error) {
    console.error("신고 생성 에러:", error);
    throw error;
  }
};