import client from "./client";

/* 로그인 */
export async function postLogin(email, password) {
  const response = await client.post("/api/v1/auth/login", {
    email: email,
    password: password,
  });
  return response;
}

/* 회원가입 */
//store 별도로 생성 시 사용하기
export async function postSignUp(email, password) {
  const response = await client.post("/api/v1/auth/signup", {
    username: email,
    nickname: email,
    email: email,
    password: email,
    passwordCheck: email,
  });
  return response;
}

/* 비밀번호 찾기 */
export async function patchResetPassword(email, newPassword, confirmPassword) {
  const response = await client.patch("/api/v1/auth/reset/password", {
    email: email,
    newPassword: newPassword,
    confirmPassword: confirmPassword,
  });
  return response;
}

/* 이메일 인증 */
export async function postEmailVerification(email) {
  const response = await client.post(
    `/api/v1/auth/signup/email/send?email=${email}`
  );
  return response;
}

export async function postResetEmailVerification(email) {
  const response = await client.post(
    `/api/v1/auth/reset/email/send?email=${email}`
  );
  return response;
}

export async function postEmailVerify(email, code) {
  const response = await client.post(
    `/api/v1/auth/email/verify?email=${email}&code=${code}`
  );
  return response;
}

/* 닉네임 검증 */

export async function getNickNameVerify(nickname) {
  const encoded = encodeURIComponent(nickname);
  const response = await client.get(
    `/api/v1/auth/nickname/available?nickname=${encoded}`
  );
  return response;
}
