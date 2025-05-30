import client from './client';

export async function getRecruit(params = {}) {
    const {
        firstCategory = 0,
        secondCategory = 0,
        thirdCategory = 0,
        page = 0,
        size = 10,
        sort = "createdAt,desc"
    } = params;

    const response = await client.get('/api/v1/recruit', {
        params: {
            firstCategory,
            secondCategory,
            thirdCategory,
            page,
            size,
            sort
        }
    });
    return response;
}
