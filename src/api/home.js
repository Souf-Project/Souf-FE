import client from "./client";
import axios from "axios";

export const getMainViewCount = async () => {
  try {
    const response = await client.get("/api/v1/view/main");
    return response.data;
  } catch (error) {
    console.error("메인 방문자수 조회 에러:", error);
    throw error;
  }
};