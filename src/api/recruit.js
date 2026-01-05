import client from "./client";
import axios from "axios";

export const getPopularRecruit = async () => {
  try {
    const response = await client.get("/api/v1/recruit/popular");
    return response.data;
  } catch (error) {
    // console.error("인기 공고문 조회 에러:", error);
    throw error;
  }
};

export async function getRecruit(params = {}) {

    try {
        const {
            firstCategory,
            secondCategory,
            thirdCategory,
            selectedCategories,
            recruitSearchReqDto = {},
            page = page,
            size = size,
            sort,
        } = params;

        // 카테고리 데이터 구성
        let categories = null;
        
        // 새로운 다중 카테고리 선택이 있는 경우
        if (selectedCategories && selectedCategories.length > 0) {
            categories = selectedCategories;
        }
        // 기존 단일 카테고리 선택이 있는 경우 (selectedCategories가 없을 때만)
        else if ((firstCategory || secondCategory || thirdCategory) && (!selectedCategories || selectedCategories.length === 0)) {
            categories = [{
                firstCategory: firstCategory || null,
                secondCategory: secondCategory || null,
                thirdCategory: thirdCategory || null
            }];
        }

        // 정렬 옵션 구성
        let sortOption = {
            sortKey: "RECENT",
            sortDir: "DESC"
        };

        if (sort && sort.length > 0) {
            const sortString = sort[0];
            
            // 새로운 정렬 옵션 처리
            if (sortString.includes('RECENT')) {
                sortOption.sortKey = "RECENT";
            } else if (sortString.includes('VIEWS')) {
                sortOption.sortKey = "VIEWS";
            } else if (sortString.includes('PAYMENT')) {
                sortOption.sortKey = "PAYMENT";
            }
            
            if (sortString.includes('_DESC')) {
                sortOption.sortDir = "DESC";
            } else if (sortString.includes('_ASC')) {
                sortOption.sortDir = "ASC";
            }
        }

        // 요청 바디 구성
        const requestBody = {
                title: recruitSearchReqDto.title?.trim() || null,
                content: recruitSearchReqDto.content?.trim() || null,
                categories: categories,
                sortOption: sortOption
        };
      
        const response = await client.post('/api/v1/recruit/search', requestBody, {
            params: {
                page: page,
                size: size,
            },
          
        });
          
        return response;
    } catch (error) {
        console.error('Recruit API 오류 발생:', error);
        
        throw error;
    }
}

export async function getRecruitDetail(recruitId) {
    try {
        const token = localStorage.getItem('accessToken');
        const url = `/api/v1/recruit/${recruitId}`;
     
        const response = await client.get(url);
        
        // console.log("API Response:", response);
        return response;
    } catch (error) {
        // console.error('Recruit Detail API 오류 발생:', error);
        // console.error('Error response:', error.response);
        // console.error('Error status:', error.response?.status);
        // console.error('Error data:', error.response?.data);
        
        // if (error.response?.status === 403) {
        //     console.error('403 Forbidden - 권한이 없습니다.');
        //     console.error('Response data:', error.response.data);
            
        //     // 토큰이 만료되었거나 유효하지 않은 경우
        //     if (error.response.data?.message?.includes('token') || 
        //         error.response.data?.message?.includes('unauthorized')) {
        //         console.log('토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
        //         localStorage.removeItem('accessToken');
        //         window.location.href = '/login';
        //         return;
        //     }
        // }
        
        throw error;
    }
}

export async function uploadRecruit(data) {
    try {
        const response = await client.post('/api/v1/recruit', data);
        return response;
    } catch (error) {
        console.error('Recruit Upload API 오류 발생:', error);
        throw error;
    }
}

export async function updateRecruit(recruitId, data) {
    // console.log("data", data);
    try {
        const response = await client.patch(`/api/v1/recruit/${recruitId}`, data);
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
export const postRecruitMedia = async ({ recruitId, fileUrl, fileName, fileType, purpose }) => {
  try {
    const response = await client.post("/api/v1/recruit/upload", {
      postId: recruitId,
      fileUrl: fileUrl,
      fileName: fileName,
      fileType: fileType,
      filePurpose: purpose
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
      
        const url = '/api/v1/recruit/my';
       
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
        });
        return response;
    } catch (error) {
        console.error('Recruit 지원 마감 API 오류 발생:', error);
        throw error;
    }
}