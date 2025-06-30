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
    const { nickname } = UserStore();
    // console.log("nickname", nickname);
  const [newMessage, setNewMessage] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const scrollRef = useRef(null);

  const {
    data: chatMessages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chatRoom", roomId],
    queryFn: async () => {
      // const data = await getChatRooms(roomId);
      // console.log("채팅 조회:", data);
      return data;
    },
    keepPreviousData: true,
  });

  // 기존 메시지와 실시간 메시지를 합쳐서 표시
  const allMessages = [...(chatMessages || []), ...realtimeMessages, ...pendingMessages];

  // console.log("모든 메시지:", allMessages);

  useEffect(() => {
    connectChatSocket(roomId, (incomingMessage) => {
      console.log("실시간 메시지 수신:", incomingMessage);
      
      // 내가 보낸 메시지가 서버에서 돌아온 경우, pending에서 제거
      // 실시간 구현하다가 내가 보낸 메세지 수신시 두번씩 보이는 에러 있었음 ㅠ 
      if (incomingMessage.sender === nickname) {
        setPendingMessages((prev) => 
          prev.filter(msg => msg.content !== incomingMessage.content)
        );
      }
      
      setRealtimeMessages((prev) => [...prev, incomingMessage]);
    });

    return () => {
      disconnectChatSocket();
    };
  }, [roomId, nickname]);

  // 스크롤 자동 내리기
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageObj = {
      roomId,
      sender: nickname,
      type: "TALK",
      content: newMessage,
    };

    // 임시로 pending에 추가 (즉시 화면에 표시!)
    const tempMessage = {
      sender: nickname,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isPending: true
    };
    
    setPendingMessages((prev) => [...prev, tempMessage]);

    sendChatMessage(messageObj);
    // console.log("메시지 전송:", messageObj);

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
    {allMessages?.map((chat, idx) => {
      const isMyMessage = chat.sender === nickname;

      return isMyMessage ? (
        <SenderMessage 
          key={`${chat.sender}-${idx}-${chat.timestamp || idx}`} 
          content={chat.content} 
          isPending={chat.isPending}
        />
      ) : (
        <ReceiverMessage 
          key={`${chat.sender}-${idx}-${chat.timestamp || idx}`} 
          content={chat.content} 
        />
      );
    })}
    <div ref={scrollRef} />
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
      <button 
        className="bg-yellow-point text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200"
        onClick={handleSend}
      >
        전송
      </button>
    </div>
  </div>
</div>

  );
}