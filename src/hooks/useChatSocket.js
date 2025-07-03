import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '../api/chatSocket';

export const useChatSocket = (onMessageReceived) => {
  useEffect(() => {
    connectSocket(onMessageReceived);

    return () => {
      disconnectSocket();
    };
  }, []);
};