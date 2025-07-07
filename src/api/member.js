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
export async function postSignUp(formData) {
  console.log(formData);
  const response = await client.post("/api/v1/auth/signup", formData);
  console.log(response); 
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
    `/api/v1/auth/signup/email/send`,
    {
      email : email
    }
  );
  return response;
}

export async function postResetEmailVerification(email) {
  const response = await client.post(
    `/api/v1/auth/reset/email/send`,
    {
      email : email
    }
  );
  return response;
}


export async function postEmailVerify(email, code, purpose) {
  try {
    const response = await client.post(
      `/api/v1/auth/email/verify`,
      {
        email:email,
        code:code,
        purpose:purpose,
      }
    );
    console.log("✅ 응답 성공:", response);
    return response.data;
  } catch (error) {
    console.error("❌ 요청 실패:", error);
    if (error.response) {
      console.error("📡 서버 응답 에러:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error("📭 요청은 보내졌지만 응답 없음:", error.request);
    } else {
      console.error("🚨 요청 설정 중 에러:", error.message);
    }
    throw error; // 다시 던져서 useMutation onError로 보내기
  }

}


/* 닉네임 검증 */

export async function getNickNameVerify(nickname) {
  const encoded = encodeURIComponent(nickname);
  const response = await client.get(
    `/api/v1/auth/nickname/available?nickname=${encoded}`
  );
  return response;
}


/* 대학생 인증 */
export async function postStudentVerify(originalEmail, acKrEmail) {
  const response = await client.post(
    `/api/v1/member/modify/email/send`,
      {
        originalEmail: originalEmail,
        acKrEmail: acKrEmail
      }
  );
  return response;
}


/* 회원 탈퇴 */

export async function deleteMemberWithdraw(password) {
  const response = await client.delete("/api/v1/auth/withdraw", {
    data: { password },
  });
  return response;
}
 