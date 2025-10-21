import client from './client';

// 읽지 않은 알림 개수 조회
export const getUnreadNotificationCount = async () => {
  try {
    const response = await client.get('/api/v1/chatrooms/unread-count');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('읽지 않은 알림 개수 조회 에러:', error);
    throw error;
  }
};

// 알림 목록 조회
export const getNotifications = async (page = 0, size = 20) => {
  try {
    const response = await client.get('/api/v1/notifications', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('알림 목록 조회 에러:', error);
    throw error;
  }
};

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await client.patch(`/api/v1/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('알림 읽음 처리 에러:', error);
    throw error;
  }
};

// 모든 알림 읽음 처리
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await client.patch('/api/v1/notifications/read-all');
    return response.data;
  } catch (error) {
    console.error('모든 알림 읽음 처리 에러:', error);
    throw error;
  }
};
