import client from "./client";
import axios from "axios";

export const getPopularRecruit = async (pageable) => {
  try {
    const response = await client.get("/api/v1/recruit/popular", {
      params: {
        page: pageable.page,
        size: pageable.size,
      },
    });
    return response.data;
  } catch (error) {
    console.error("인기 공고문 조회 에러:", error);
    throw error;
  }
};

export async function getRecruit(params = {}) {
    try {
    const {
      firstCategory = 1,
      secondCategory ,
      thirdCategory,
      recruitSearchReqDto = {},
      page = 0,
      size = 10,
      sort,
    } = params;   
    

        const queryParams = {
            firstCategory,
            ...(secondCategory ? { secondCategory } : {}),
            ...(thirdCategory ? { thirdCategory } : {}),
            'page': page,
            'size': size
        };

        // console.log("Query params:", queryParams);

        if (recruitSearchReqDto.title?.trim()) {
            queryParams['title'] = recruitSearchReqDto.title;
        }
        if (recruitSearchReqDto.content?.trim()) {
            queryParams['content'] = recruitSearchReqDto.content;
        }

        if (sort && sort.length > 0) {
            queryParams['sort'] = sort?.join(',');
        }

        // 토큰 확인
        const token = localStorage.getItem('accessToken');
        console.log("Token exists:", !!token);
        if (token) {
            console.log("Token preview:", token.substring(0, 20) + "...");
        }

        const response = await client.get('/api/v1/recruit', {
            params: queryParams,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response;
    } catch (error) {
        console.error('Recruit API 오류 발생:', error);
        
        if (error.response?.status === 403) {
            console.error('403 Forbidden - 권한이 없습니다.');
            console.error('Response data:', error.response.data);
            
            // 토큰이 만료되었거나 유효하지 않은 경우
            if (error.response.data?.message?.includes('token') || 
                error.response.data?.message?.includes('unauthorized')) {
                console.log('토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return;
            }
        }
        
        throw error;
    }
}

export async function getRecruitDetail(recruitId) {
    try {
        const token = localStorage.getItem('accessToken');
        console.log("Token exists:", !!token);
        if (token) {
            console.log("Token preview:", token.substring(0, 20) + "...");
        }

        const url = `/api/v1/recruit/${recruitId}`;
     

        const response = await client.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log("API Response:", response);
        return response;
    } catch (error) {
        console.error('Recruit Detail API 오류 발생:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        
        if (error.response?.status === 403) {
            console.error('403 Forbidden - 권한이 없습니다.');
            console.error('Response data:', error.response.data);
            
            // 토큰이 만료되었거나 유효하지 않은 경우
            if (error.response.data?.message?.includes('token') || 
                error.response.data?.message?.includes('unauthorized')) {
                console.log('토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return;
            }
        }
        
        throw error;
    }
}

export async function uploadRecruit(data) {
    try {
        const response = await client.post('/api/v1/recruit', data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error('Recruit Upload API 오류 발생:', error);
        throw error;
    }
}

export async function updateRecruit(recruitId, data) {
    try {
        const response = await client.patch(`/api/v1/recruit/${recruitId}`, data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error('Recruit Update API 오류 발생:', error);
        throw error;
    }
}

// S3 업로드 함수
export const uploadToS3 = async (url, file) => {
  return axios.put(url, file , {
    headers: {
        "Content-Type": file.type,  // 백엔드에서 서명한 값과 정확히 일치시켜야 함!
  },
});
};

// 공고문 미디어 정보 저장 함수 (피드와 동일한 형식)
export const postRecruitMedia = async ({ recruitId, fileUrl, fileName, fileType }) => {
  try {
    const response = await client.post("/api/v1/recruit/upload", {
      postId: recruitId,
      fileUrl: fileUrl,
      fileName: fileName,
      fileType: fileType,
    });
    return response.data;
  } catch (error) {
    console.error("공고문 이미지 업로드 에러:", error);
    throw error;
  }
};

// 내가 작성한 공고문 리스트 조회
export async function getMyRecruits(pageable = { page: 0, size: 10 }) {
    try {
        const token = localStorage.getItem('accessToken');
        console.log("Token exists:", !!token);
        if (token) {
            console.log("Token preview:", token.substring(0, 20) + "...");
        }

        const url = '/api/v1/recruit/my';
        console.log("Calling API:", url);
        console.log("Base URL:", import.meta.env.VITE_BASE_URL);
        console.log("Full URL:", import.meta.env.VITE_BASE_URL + url);

        const response = await client.get(url, {
            params: {
                page: pageable.page,
                size: pageable.size,
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log("API Response:", response);
        return response;
    } catch (error) {
        console.error('내 공고문 조회 API 오류 발생:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        
        if (error.response?.status === 403) {
            console.error('403 Forbidden - 권한이 없습니다.');
            console.error('Response data:', error.response.data);
            
            // 토큰이 만료되었거나 유효하지 않은 경우
            if (error.response.data?.message?.includes('token') || 
                error.response.data?.message?.includes('unauthorized')) {
                console.log('토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return;
            }
        }
        
        throw error;
    }
}

export async function closeRecruit(recruitId, memberId) {
    try {
        const response = await client.patch(`/api/v1/recruit/closure/${recruitId}`, {
            memberId: memberId
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error('Recruit 지원 마감 API 오류 발생:', error);
        throw error;
    }
}