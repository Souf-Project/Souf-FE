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
  "tags": "[봄, 산책, 나들이, 어린이 대공원]('#'는 빼고 보내주세요!",
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

export const postFeed = async (postData) => {
  const response = await axios.post("/api/v1/feed", postData);
  return response.data.result;
};

export const uploadToS3 = async (url, file) => {
  return axios.put(url, file, {
    headers: { "Content-Type": file.type },
  });
};

export const postMedia = async ({ feedId, fileUrl, fileName, fileType }) => {
  try {
    const response = await client.post("/api/v1/feed/upload", {
      postId: feedId,
      fileUrl,
      fileName,
      fileType,
    });
    return response.data;
  } catch (error) {
    console.error("인기 피드 조회 에러:", error);
    throw error;
  }
};
