import axios from "axios";
import client from "./client";

/* 지원하기 */
export async function postApplication(recruitId) {
    const accessToken = localStorage.getItem('accessToken');
    const response = await client.post(`/api/v1/applications/${recruitId}/apply`, {}, {
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

/* 지원 거절하기 */
export const postApplicationReject = async (applicationId) => {
  try {
    const response = await client.post(`/api/v1/applications/${applicationId}/reject`);
    return response.data;
  } catch (error) {
    console.error("지원 거절 에러:", error);
    throw error;
  }
};