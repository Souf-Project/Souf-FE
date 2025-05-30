import axios from 'axios';

export const getPopularFeed = async (pageable) => {
  try {
    const response = await axios.get('/api/v1/feed/popular', {
      params: {
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort
      }
    });
    return response.data;
  } catch (error) {
    console.error('인기 피드 조회 에러:', error);
    throw error;
  }
};
