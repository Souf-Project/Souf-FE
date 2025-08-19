import client from "./client";

// 소셜 로그인 (카카오, 구글)
export const postSocialLogin = async (requestBody) => {
  try {
    const response = await client.post("/api/v1/social/login", requestBody);
    return response.data;
  } catch (error) {
    console.error("소셜 로그인 에러:", error);
    throw error;
  }
};

// 소셜 회원가입
export const postSocialSignUp = async (requestBody) => {
  try {
    const response = await client.post("/api/v1/social/complete-signup", requestBody);
    return response.data;
  } catch (error) {
    console.error("소셜 회원가입 에러:", error);
    throw error;
  }
};

