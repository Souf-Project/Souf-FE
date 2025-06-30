// src/api/chatSocket.js

import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectChatSocket = (roomId, onMessage) => {
  const socket = new WebSocket("wss://api-souf.co.kr/ws");
  const accessToken = localStorage.getItem('accessToken');

  stompClient = new Client({
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("WebSocket 연결됨");

      // 메시지 구독
      stompClient.subscribe(`/topic/chatroom.${roomId}`, (message) => {
        const payload = JSON.parse(message.body);
        console.log(payload);
        onMessage(payload);
      });
    },
    onStompError: (frame) => {
      console.error("STOMP 오류:", frame);
    },
  });

  stompClient.activate();
};

export const sendChatMessage = (message) => {
  stompClient.publish({
    destination: "/app/chat.sendMessage",
   
    body: JSON.stringify(message),
  });
};

export const disconnectChatSocket = () => {
  if (stompClient) stompClient.deactivate();
};