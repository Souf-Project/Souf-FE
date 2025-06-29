import client from "./client";

export const getChat = async (memberId,feedId) => {
  try {
    const response = await client.get(`/api/v1/chatrooms`);
    return response.data;
  } catch (error) {
    console.error("채팅 에러:", error);
    throw error;
  }
};



export async function putChatRooms(roomId) {
  const response = await client.put(`/api/v1/chatrooms/${roomId}/read`, data, 
  );
  return response;
}



export const getChatRooms = async (roomId) => {
  try {
    const response = await client.get(`/api/v1/chatrooms/${roomId}/messages`);
    return response.data;
  } catch (error) {
    console.error("채팅 에러:", error);
    throw error;
  }
};


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