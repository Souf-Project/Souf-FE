import axios from "axios";
import client from "./client";

export const getFavorite = async (id, page = 0, size = 20) => {
  try {
    const response = await client.get("/api/v1/favorite", {
      params: {
        id: id,
        page: page,
        size: size,
      },
    });
    return response.data;
  } catch (error) {
    console.error("즐겨찾기 조회 에러:", error);
    throw error;
  }
};

export const postFavorite = async (fromMemberId, toMemberId) => {
    try {
      const response = await client.post("/api/v1/favorite", {
        fromMemberId: fromMemberId,
        toMemberId: toMemberId,
      });
      return response.data;
    } catch (error) {
      console.error("즐겨찾기 생성 에러:", error);
      throw error;
    }
  };  

  export const deleteFavorite = async (fromMemberId, toMemberId) => {
    try {
      const response = await client.delete("/api/v1/favorite", {
        data: {
          fromMemberId: fromMemberId,
          toMemberId: toMemberId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("즐겨찾기 삭제 에러:", error);
      throw error;
    }
  };
  