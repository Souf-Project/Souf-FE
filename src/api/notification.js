import client from './client';

// 읽지 않은 알림 개수 조회
export const getUnreadChatCount = async () => {
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
export const getNotificationList = async (page = 0, size = 20) => {
  try {
    const response = await client.get('/api/v1/notifications/unread-count');
      return response.data;
  } catch (error) {
    console.error('알림 개수 조회 에러:', error);
    throw error;
  }
};
  
// 알림 읽음 처리
export const readNotification = async (notificationId) => {
  try {
    const response = await client.delete(`/api/v1/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('알림 읽음 처리 에러:', error);
    throw error;
  }
};

// 알림 내용 조회
export const getNotificationContent = async () => {
  try {
    const response = await client.get(`/api/v1/notifications`);
    return response.data;
  } catch (error) {
    console.error('알림 내용 조회 에러:', error);
    throw error;
  }
};
