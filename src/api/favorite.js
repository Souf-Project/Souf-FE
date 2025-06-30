import axios from "axios";
import client from "./client";

export const getFavorite = async (fromMemberId, toMemberId) => {
  try {
    const response = await client.get("/api/v1/favorite", {
      params: {
        fromMemberId: fromMemberId,
        toMemberId: toMemberId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("즐겨찾기 조회 에러:", error);
    throw error;
  }
};