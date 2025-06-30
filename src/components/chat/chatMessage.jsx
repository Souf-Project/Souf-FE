import { useQuery } from "@tanstack/react-query";
import { getChatRooms } from "../../api/chat";
import ReceiverMessage from "./ReceiverMessage";
import SenderMessage from "./senderMessage";
import { UserStore } from "../../store/userStore";
import { useRef, useState,useEffect } from "react";
import {
  connectChatSocket,
  disconnectChatSocket,
  sendChatMessage,
} from "../../api/chatSocket";

export default function ChatMessage({ chatUsername,roomId }) {
    const { username } = UserStore();
  const [newMessage, setNewMessage] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const scrollRef = useRef(null);

  
  /*
  const chatMessages = [
    {
      id: 1,
      sender: "Alice",
      content: "Hey, are you awake? 😴",
      time: "2025-05-18T05:10:00",
      fromMe: false,
    },
    {
      id: 2,
      sender: "Me",
      content: "Yeah, just woke up. What's up?",
      time: "2025-05-18T05:11:30",
      fromMe: true,
    },
    {
      id: 3,
      sender: "Alice",
      content: "Did you finish the report for our project?",
      time: "2025-05-18T05:12:00",
      fromMe: false,
    },
    {
      id: 4,
      sender: "Me",
      content: "Almost! I’ll send it in 20 minutes.",
      time: "2025-05-18T05:12:45",
      fromMe: true,
    },
    {
      id: 5,
      sender: "Alice",
      content: "Okay cool 😎",
      time: "2025-05-18T05:13:00",
      fromMe: false,
    },
    {
      id: 6,
      sender: "Me",
      content: "BTW, did you check the new designs?",
      time: "2025-05-18T05:14:10",
      fromMe: true,
    },
    {
      id: 7,
      sender: "Alice",
      content: "Yes, love them! Especially the dark mode one 🔥",
      time: "2025-05-18T05:14:30",
      fromMe: false,
    },
    {
      id: 8,
      sender: "Me",
      content: "Right? I thought you’d like that. 😄",
      time: "2025-05-18T05:14:50",
      fromMe: true,
    },
  ];*/

      const {
    data: chatMessages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chatRoom"],
    queryFn: async () => {
      const data = await getChatRooms(roomId);
      
      console.log("채팅 조회:", data);
      return data;
    },
    keepPreviousData: true,
  });

    useEffect(() => {
    connectChatSocket(roomId, (incomingMessage) => {
      setRealtimeMessages((prev) => [...prev, incomingMessage]);
    });

    return () => {
      disconnectChatSocket();
    };
  }, [roomId]);

  // 스크롤 자동 내리기
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, realtimeMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageObj = {
      roomId,
      type: "TEXT",
      content: newMessage,
    };

    // 소켓으로 전송
    sendChatMessage(messageObj);

    // 나도 화면에 표시
    setRealtimeMessages((prev) => [
      ...prev,
      { sender: username, content: newMessage },
    ]);

    setNewMessage("");
  };

  return (
   <div className="h-full flex flex-col">
  {/* 채팅 헤더 */}
  <div className="p-4 border-b border-gray-200">
    <h2 className="font-semibold">{chatUsername}</h2>
  </div>

  {/* 채팅 메시지 영역 */}
  <div className="flex-1 p-4 overflow-y-auto">
    <div className="text-center text-gray-500 text-sm mb-4">
      {new Date().toLocaleDateString()}
    </div>
    {chatMessages?.map((chat, idx) =>
      chat.sender === username ? (
        <SenderMessage key={idx} content={chat.content} />
      ) : (
        <ReceiverMessage key={idx} content={chat.content} />
      )
    )}
  </div>

  {/* 메시지 입력 영역 */}
  <div className="p-4 border-t border-gray-200">
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="메시지를 입력하세요"
        className="flex-grow px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-yellow-point"
        value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button className="bg-yellow-point text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200">
        전송
      </button>
    </div>
  </div>
</div>

  );
}
