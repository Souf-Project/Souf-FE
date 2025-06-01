import client from './client';

export async function getRecruit(params = {}) {
    const {
        firstCategory = 0,
        page = 0,
        size = 10,
        sort = "createdAt,desc"
    } = params;

    const response = await client.get('/api/v1/recruit', {
        params: {
            firstCategory,
            page,
            size,
            sort
        }
    });
    return response;
}
