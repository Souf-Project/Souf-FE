import axios from "axios";
import client from "./client";

export const getPopularFeed = async (pageable) => {
  try {
    const response = await client.get("/api/v1/feed/popular", {
      params: {
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


export const postFeed = async (data) => {
  try {
    const res = await client.post("/api/v1/feed", data);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("postFeed error:", err);
    throw err; // 꼭 다시 throw 해야 mutation이 onError로 연결됨
  }
};

export const uploadToS3 = async (url, file) => {
  return axios.put(url, file, {});
};
// headers: { "Content-Type": file.type },

export const postMedia = async ({ feedId, fileUrl, fileName, fileType }) => {
  try {
    const response = await client.post("/api/v1/feed/upload", {
      postId: feedId,
      fileUrl: fileUrl,
      fileName: fileName,
      fileType: fileType,
    });
    return response.data;
  } catch (error) {
    console.error("피드 이미지 조회 에러:", error);
    throw error;
  }
};

export const getFeed = async (firstCategory, pageable) => {
  try {
    const response = await client.get("/api/v1/feed", {
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


export const getFeedDetail = async (memberId,feedId) => {
  try {
    const response = await client.get(`/api/v1/feed/${memberId}/${feedId}`);
    return response.data;
  } catch (error) {
    console.error("피드 상세 조회 에러:", error);
    throw error;
  }
};



export const getMemberFeed = async (memberId) => {
  try {
    const response = await client.get(`/api/v1/feed/${memberId}`);
    return response.data;
  } catch (error) {
    console.error("특정 학생 피드 조회 에러:", error);
    throw error;
  }
};

export async function updateFeed(feedId, data) {
  try {
    const response = await client.patch(`/api/v1/feed/${feedId}`, data);
    return response.data;
  } catch (error) {
    console.error("피드 수정 에러", error);
    throw error;
  }
}

export async function deleteFeed(feedId) {
  try {
    const response = await client.delete(`/api/v1/feed/${feedId}`);
    return response.data;
  } catch (error) {
    console.error("피드 삭제 에러", error);
    throw error;
  }
}



