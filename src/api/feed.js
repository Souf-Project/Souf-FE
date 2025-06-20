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

/*
{
  "topic": "봄 프로젝트 1회차",
  "content": "오늘 작업 내용...",
  "tags": [], // 빈 배열로 보내거나 태그가 있을 때 배열로 보내기
  "originalFileNames": "[fileName.jpg, dog.jpg..]",
  "categoryDtos": [
    {
      "firstCategory": 1,
      "secondCategory": 1,
      "thirdCategory": 1
    },
    {
      "firstCategory": 1,
      "secondCategory": 1,
      "thirdCategory": 2
    },
    {
      "firstCategory": 1,
      "secondCategory": 1,
      "thirdCategory": 4
    }
  ]
} */

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
