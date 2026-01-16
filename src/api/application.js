import axios from "axios";
import client from "./client";

/* 지원하기 */
export async function postApplication(recruitId, requestBody) {
    const accessToken = localStorage.getItem('accessToken');
    const response = await client.post(`/api/v1/applications/${recruitId}/apply`, requestBody, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return response;
}

/* 내 지원 리스트 조회 */
export async function getMyApplications(pageable = { page: 0, size: 10 }) {
    const accessToken = localStorage.getItem('accessToken');
    const response = await client.get('/api/v1/applications/my', {
        params: {
          page: pageable.page,
          size: pageable.size,
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return response;
}

/* 특정 공고문 지원자 리스트 조회 */
export async function getApplicantsByRecruitId(recruitId, pageable = { page: 0, size: 10 }) {
    const accessToken = localStorage.getItem('accessToken');
    const response = await client.get(`/api/v1/applications/${recruitId}/applicants`, {
        params: {
          page: pageable.page,
          size: pageable.size,
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return response;
}

/* 지원 승인/거절하기 */
export const patchApplicationDecision = async (applicationId, decision) => {
  try {
    const response = await client.patch(`/api/v1/applications/${applicationId}/decision`, {
      decision: decision 
    });
    return response.data;
  } catch (error) {
    console.error("지원 승인/거절 에러:", error);
    throw error;
  }
};

/* 지원 취소 */
export async function cancelApplication(applicationId) {
  const response = await client.delete(`/api/v1/applications/${applicationId}`);
  return response;
}