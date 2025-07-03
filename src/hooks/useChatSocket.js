import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '../api/chatSocket';

export const useChatSocket = (onMessageReceived) => {
  useEffect(() => {
    connectSocket(onMessageReceived);

    return () => {
      disconnectSocket();
    };
  }, []);
<<<<<<< HEAD
};
=======
};
>>>>>>> 615b349c8c4329adad7c0b28e58ed25c603dada5
