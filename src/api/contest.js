import axios from "axios";

export const getContests = async (type = "rendering") => {
  try {
    const response = await axios.get("https://ec3yu3zhsa.execute-api.ap-northeast-2.amazonaws.com/dev/contests", {
      params: { type },
    });
    return response.data;
  } catch (error) {
    console.error("컨테스트 조회 에러:", error);
    throw error;
  }
};