import client from './client';

export async function getRecruit(params = {}) {
    try {
        const {
            firstCategory = 0,
            secondCategory = 0,
            thirdCategory = 0,
            recruitSearchReqDto = { title: '', content: '' },
            pageable = { page: 0, size: 10, sort: ["createdAt,desc"] }
        } = params;

        const response = await client.post('/api/v1/recruit', {
            firstCategory,
            secondCategory,
            thirdCategory,
            recruitSearchReqDto,
            pageable
        });

        return response;
    } catch (error) {
        console.error('Recruit API 오류 발생:', error);
        throw error;
    }
}
