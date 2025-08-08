import axios from "axios";
import client from "./client";

// 동영상 업로드 API
export const postChatVideo = async (video) => {
  const response = await client.post(`/api/v1/chat/video-upload`, {
    originalFileNames: video,
  });
  return response.data;
};

export const postVideoSignedUrl = async ({ uploadId , partNumber , fileName}) => {
  try {
    const response = await client.post("/api/v1/upload/upload-signed-url", {
      uploadId: uploadId,
      partNumber: partNumber,
      fileName: fileName,
    });
    return response.data;
  } catch (error) {
    console.error("피드 이미지 조회 에러:", error);
    throw error;
  }
};

export const postVideoUpload = async ({ uploadId , fileUrl, parts, type}) => {
  try {
    const response = await client.post("/api/v1/upload/complete-video-upload", {
      uploadId: uploadId,
      fileUrl: fileUrl,
      parts : parts,
      type:type
    });
    return response.data;
  } catch (error) {
    console.error("피드 이미지 조회 에러:", error);
    throw error;
  }
};

export const uploadToS3Video = async (url, file) => {
  return axios.put(url, file, {
    headers: {
      "Content-Type": `video/${file.type}`, // 백엔드에서 서명한 값과 정확히 일치시켜야 함!
    },
  });
};