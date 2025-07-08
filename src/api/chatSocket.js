import { Client } from "@stomp/stompjs";

let stompClient = null;
const accessToken = localStorage.getItem("accessToken");

export const connectChatSocket = (roomId, onMessage) => {
  console.log("🔌 WebSocket 연결 시도:", roomId);
  
  const socket = new WebSocket("wss://api-souf.co.kr/ws");
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`, // ✅ 여기에 토큰 넣기!
    },
    onConnect: () => {
      console.log("✅ WebSocket 연결 성공");

      // 메시지 구독
      stompClient.subscribe(`/topic/chatroom.${roomId}`, (message) => {
        const payload = JSON.parse(message.body);
        console.log("📨 메시지 수신:", payload);
        onMessage(payload);
      });
    },
    onStompError: (frame) => {
      console.error("❌ STOMP 에러:", frame);
    },
    onWebSocketClose: () => {
      console.log("❌ WebSocket 연결 종료됨");
    },
    onWebSocketError: (error) => {
      console.error("❌ WebSocket 에러:", error);
    },
  });

  console.log("🔌 WebSocket 활성화 시작...");
  stompClient.activate();
};

export const sendChatMessage = (message) => {
  console.log("📤 메시지 전송 시도:", message);
  
  if (!stompClient || !stompClient.connected) {
    console.error("❌ WebSocket 연결 상태가 올바르지 않습니다.");
    return false;
  }

  try {
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message),
    });
    console.log("✅ 메시지 전송 성공:", message.content);
    return true;
  } catch (error) {
    console.error("❌ 메시지 전송 실패:", error);
    return false;
  }
};

export const disconnectChatSocket = () => {
  if (stompClient) stompClient.deactivate();
      // 연결 끊기면 자동 연결?
};
