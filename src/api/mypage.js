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
  const accessToken = localStorage.getItem("accessToken");
  const response = await client.put("/api/v1/member/update", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/* 2. S3 업로드 후, 이미지 정보 최종 전송 */
export async function confirmImageUpload({ postId, fileUrl, fileName, fileType }) {
    const accessToken = localStorage.getItem("accessToken");
    const requestData = {
      postId,
      fileUrl:  Array.isArray(fileUrl) ? fileUrl : [fileUrl],
      fileName: Array.isArray(fileName) ? fileName : [fileName],
      fileType: Array.isArray(fileType)
    ? fileType.map(type => type.toUpperCase())
    : [fileType.toUpperCase()],
};
    
    console.log("S3 업로드 후 /upload 엔드포인트로 전송될 최종 데이터:", requestData);

    const response = await client.post("/api/v1/member/upload", 
        requestData, 
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );
    console.log(response);
    return response.data;
}

/* 프로필 조회 */
export async function getProfile() {
  const accessToken = localStorage.getItem("accessToken");
  const response = await client.get("/api/v1/member/myinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response);
  return response;
}

/* 프로필 수정 */
export async function putProfileEdit(data) {
  const accessToken = localStorage.getItem("accessToken");
  const response = await client.put("/api/v1/member/update", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response;
}