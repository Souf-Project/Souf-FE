// src/api/chatSocket.js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectChatSocket = (roomId, onMessage) => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("WebSocket 연결됨");

      // 메시지 구독
      stompClient.subscribe(`/topic/chatroom.${roomId}`, (message) => {
        const payload = JSON.parse(message.body);
        onMessage(payload);
      });
    },
  });

  stompClient.activate();
};

export const sendChatMessage = (message) => {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: "/app/chat.sendMessage",
    body: JSON.stringify(message),
  });
};

export const disconnectChatSocket = () => {
  if (stompClient) stompClient.deactivate();
};
