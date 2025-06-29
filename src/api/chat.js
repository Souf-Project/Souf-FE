import client from "./client";

export const postChatrooms = async (receiverId) => {
    try {
      const response = await client.post("/api/v1/chatrooms", {
        receiverId: receiverId,
      } );
      return response.data;
    } catch (error) {
      console.error("채팅방 생성 에러:", error);
      throw error;
    }
  };