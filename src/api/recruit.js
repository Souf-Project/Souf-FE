import client from './client';

export const getRecruit = async (params = {}) => {
    try {
        const {
            firstCategory = 0,
            secondCategory = 0,
            thirdCategory = 0,
            page = 0,
            size = 10,
            sort = "createdAt,desc"
        } = params;

        const response = await client.get('/recruit', {
            params: {
                firstCategory,
                secondCategory,
                thirdCategory,
                page,
                size,
                sort
            }
        });
        
        if (response.data && response.data.result) {
            return response.data.result;
        } else if (response.data && Array.isArray(response.data)) {
            return response.data;
        } else {
            console.error('Unexpected response structure:', response.data);
            return [];
        }
    } catch (error) {
        console.error('공고문 조회 에러', error);
        if (error.response?.status === 403) {
            // 403 에러는 이미 client.js의 인터셉터에서 처리됨
            return [];
        }
        throw error;
    }
};
