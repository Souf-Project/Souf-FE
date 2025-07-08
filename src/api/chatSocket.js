import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

let stompClient = null;
let isConnecting = false;

export const connectChatSocket = (roomId, onMessage) => {
  console.log("🔌 WebSocket 연결 시도:", roomId);
  
  // 이미 연결 중이거나 연결된 상태면 중복 연결 방지
  if (isConnecting || (stompClient && stompClient.connected)) {
    console.log("이미 연결 중이거나 연결된 상태입니다.");
    return;
  }
  
  isConnecting = true;
  
  const accessToken = localStorage.getItem("accessToken");
  
  // SockJS를 사용하여 연결
  const socket = new WebSocket("ws://api-souf.co.kr/ws");
  
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
    onConnect: () => {
      console.log("✅ WebSocket 연결 성공");
      isConnecting = false;

      // 메시지 구독
      stompClient.subscribe(`/topic/chatroom.${roomId}`, (message) => {
        try {
          const payload = JSON.parse(message.body);
          console.log("📨 메시지 수신:", payload);
          onMessage(payload);
        } catch (error) {
          console.error("메시지 파싱 에러:", error);
        }
      });
    },
    onStompError: (frame) => {
      console.error("❌ STOMP 에러:", frame);
      console.error("에러 헤더:", frame.headers);
      console.error("에러 메시지:", frame.body);
      isConnecting = false;
    },
    onWebSocketClose: () => {
      console.log("❌ WebSocket 연결 종료됨");
      isConnecting = false;
    },
    onWebSocketError: (error) => {
      console.error("❌ WebSocket 에러:", error);
      isConnecting = false;
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
    const messageToSend = {
      roomId: message.roomId,
      sender: message.sender,
      type: message.type,
      content: message.content,
      timestamp: new Date().toISOString()
    };
    
    console.log("전송할 메시지:", messageToSend);
    
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(messageToSend),
      headers: {
        'content-type': 'application/json'
      }
    });
    console.log("✅ 메시지 전송 성공:", message.content);
    return true;
  } catch (error) {
    console.error("❌ 메시지 전송 실패:", error);
    return false;
  }
};

export const disconnectChatSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
  isConnecting = false;
};
