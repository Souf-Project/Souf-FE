import client from './client';

// 읽지 않은 채팅 개수 조회
export const getUnreadChatCount = async () => {
  try {
    const response = await client.get('/api/v1/chatrooms/unread-count');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('읽지 않은 채팅 개수 조회 에러:', error);
    throw error;
  }
};

// 읽지 않은 알림 개수 조회
export const getNotificationCount = async () => {
  try {
    const response = await client.get('/api/v1/notifications/unread-count');
    return response.data;
  } catch (error) {
    console.error('알림 개수 조회 에러:', error);
    throw error;
  }
};

// 알림 목록 조회
export const getNotificationList = async (page = 0, size = 20) => {
  try {
    const response = await client.get(`/api/v1/notifications?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('알림 목록 조회 에러:', error);
    throw error;
  }
};


  
// 알림 전체 삭제 처리
export const deleteNotifications = async () => {
  try {
    const response = await client.delete(`/api/v1/notifications`);
    return response.data;
  } catch (error) {
    console.error('알림 전체 삭제 처리 에러:', error);
    throw error;
  }
};

// 알림 개별 삭제 처리
export const deleteNotification = async (notificationId) => {
  try {
    const response = await client.delete(`/api/v1/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('알림 개별 삭제 처리 에러:', error);
    throw error;
  }
};

// 알림 전체 읽음 처리
export const patchReadNotifications = async () => {
  try {
    const response = await client.patch(`/api/v1/notifications/read`);
    return response.data;
  } catch (error) {
    console.error('알림 전체 읽음 처리 에러:', error);
    throw error;
  }
};

// 알림 개별 읽음 처리
export const patchReadNotificationContent = async (notificationId) => {
  try {
    const response = await client.patch(`/api/v1/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('알림 개별 읽음 처리 에러:', error);
    throw error;
  }
};