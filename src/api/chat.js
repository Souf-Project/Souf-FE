import client from "./client";
import axios from "axios";

export const getChat = async () => {
  try {
    const response = await client.get(`/api/v1/chatrooms`);
    return response.data;
  } catch (error) {
    console.error("채팅 에러:", error);
    throw error;
  }
};



export async function patchChatRooms(roomId) {
  const response = await client.patch(`/api/v1/chatrooms/${roomId}/read`, 
  );
  // console.log(response);
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

export const postChatImage = async (image) => {
  const response = await client.post(`/api/v1/chat/file-upload`, {
    originalFileNames: image,
  });
  return response.data;
};



export const uploadToS3 = async (url, file) => {
  return axios.put(url, file, {
    headers: {
      "Content-Type": file.type, 
    },
  });
};


export const postChatImageUpload = async ({ chatId, fileUrl, fileName, fileType }) => {
  try {
    const response = await client.post("/api/v1/chat/upload", {
      postId: chatId,
      fileUrl: fileUrl,
      fileName: fileName,
      fileType: fileType,
    });
    return response.data;
  } catch (error) {
    console.error("채팅 이미지 업로드 에러:", error);
    throw error;
  }
};

export const deleteChatRoom = async (roomId) => {
  const response = await client.post(`/api/v1/chatrooms/${roomId}/exit`);
  return response.data;
};