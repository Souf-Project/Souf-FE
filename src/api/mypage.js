import client from "./client";
import axios from "axios";

/* S3 업로드 헬퍼 */
export const uploadToS3 = async (url, file) => {
  return axios.put(url, file, {
    headers: { "Content-Type": file.type },
  });
};

/* 1. 프로필 정보 + 새 파일명 전송 (Presigned URL 반환 기대) */
export async function updateProfileInfo(data) {
  const response = await client.put("/api/v1/member/update", data, {
  });
  return response.data;
}

/* 2. S3 업로드 후, 이미지 정보 최종 전송 */
export async function confirmImageUpload({ postId, fileUrl, fileName, fileType }) {
    const requestData = {
      postId,
      fileUrl:  Array.isArray(fileUrl) ? fileUrl : [fileUrl],
      fileName: Array.isArray(fileName) ? fileName : [fileName],
      fileType: Array.isArray(fileType)
    ? fileType.map(type => type.toUpperCase())
    : [fileType.toUpperCase()],
    filePurpose: []
};
    
    console.log("S3 업로드 후 /upload 엔드포인트로 전송될 최종 데이터:", requestData);

    const response = await client.post("/api/v1/member/upload", 
        requestData, 
    );
    console.log(response);
    return response.data;
}

/* 프로필 조회 */
export async function getProfile() {
  const response = await client.get("/api/v1/member/myinfo");
  // console.log(response);
  return response;
}

/* 프로필 수정 */
// export async function putProfileEdit(data) {
//   const accessToken = localStorage.getItem("accessToken");
//   const response = await client.put("/api/v1/member/update", data, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/octet-stream",
//     },
//   });

//   return response;
// }


/* 닉네임 검증 */

export async function getNickNameVerify(nickname) {
  const encoded = encodeURIComponent(nickname);
  const response = await client.get(
    `/api/v1/auth/nickname/available?nickname=${encoded}`
  );
  return response;
}

export async function getInquiryList(pageable) {
  const response = await client.get("/api/v1/inquiry/my", {
    params: pageable,
  });
  return response;
}

export async function deleteInquiry(inquiryId) {
  const response = await client.delete(`/api/v1/inquiry/${inquiryId}`, {
  });
  return response;
}
