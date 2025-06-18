import client from "./client";

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
            secondCategory = 1,
            thirdCategory = 1,
            recruitSearchReqDto = {},
            pageable = { page: 0, size: 10, sort: ["createdAt,desc"] }
        } = params;        

        const queryParams = {
            firstCategory,
            ...(secondCategory ? { secondCategory } : {}),
            ...(thirdCategory ? { thirdCategory } : {}),
            'pageable.page': pageable.page,
            'pageable.size': pageable.size
        };

        if (recruitSearchReqDto.title?.trim()) {
            queryParams['recruitSearchReqDto.title'] = recruitSearchReqDto.title;
        }
        if (recruitSearchReqDto.content?.trim()) {
            queryParams['recruitSearchReqDto.content'] = recruitSearchReqDto.content;
        }

        if (pageable.sort && pageable.sort.length > 0) {
            queryParams['pageable.sort'] = pageable.sort.join(',');
        }

        const response = await client.get('/api/v1/recruit', {
            params: queryParams,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        return response;
    } catch (error) {
        // if (error.response?.status === 403) {
        //     // 403 에러 발생 시 로그인 페이지로 리다이렉트
        //     window.location.href = '/login';
        //     return;
        // }
        console.error('Recruit API 오류 발생:', error);
        throw error;
    }
}

// export async function uploadRecruit(data) {
//     try {
//         const response = await client.post('/api/v1/recruit', data, {
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         return response;
//     } catch (error) {
//         console.error('Recruit Upload API 오류 발생:', error);
//         throw error;
//     }
// }


