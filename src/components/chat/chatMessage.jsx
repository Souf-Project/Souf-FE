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
import plusIco from "../../assets/images/plusIco.svg"
import Checkout from "../pay/checkout";

export default function ChatMessage({ chatNickname,roomId, opponentProfileImageUrl }) {
    const { nickname } = UserStore();
  const [newMessage, setNewMessage] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [showButtonList, setShowButtonList] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const scrollRef = useRef(null);

  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

      const {
    data: chatMessages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chatRoom", roomId],
    queryFn: async () => {
      const data = await getChatRooms(roomId);
      
      console.log("채팅 조회:", data);
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

  const handlePlusClick = () => {
    setShowButtonList(!showButtonList);
  };

  const handleButton1Click = () => {
    console.log("버튼 1 클릭");
    setShowCheckout(true);
    setShowButtonList(false);
  };

  const handleButton2Click = () => {
    console.log("버튼 2 클릭");
    setShowButtonList(false);
  };

  

  return (
   <div className="h-full flex flex-col">
  {/* 채팅 헤더 */}
  <div className="p-4 border-b border-gray-200">
    <h2 className="font-semibold">{chatNickname}</h2>
  </div>

  {/* Checkout 모달 */}
  {showCheckout && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">결제</h2>
          <button 
            onClick={() => setShowCheckout(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <Checkout />
      </div>
    </div>
  )}

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
          createdTime={chat.createdTime}

        />
      ) : (
        <ReceiverMessage 
          key={`${chat.sender}-${idx}-${chat.timestamp || idx}`} 
          content={chat.content} 
          createdTime={chat.createdTime}
          opponentProfileImageUrl={S3_BUCKET_URL + opponentProfileImageUrl}
        />
      );
    })}
    <div ref={scrollRef} />
  </div>

  {/* 메시지 입력 영역 */}
  <div className="p-4 border-t border-gray-200">
    <div className="flex gap-4">
      <button 
        className="bg-gray-200 px-4 py-2 rounded-lg font-bold "
        onClick={handlePlusClick}
      >
        <img 
          src={plusIco} 
          alt="plus" 
          className={`w-4 h-4 transition-transform duration-200 ${showButtonList ? 'rotate-45' : 'rotate-0'}`} 
        />
      </button>
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
    
    {/* 버튼 리스트 */}
    {showButtonList && (
      <div className="mt-10 mb-8 flex gap-4">
        <Checkout />
        <button 
          className="bg-blue-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
          onClick={handleButton1Click}
        >
          토스
        </button>
        <button 
          className="bg-green-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
          onClick={handleButton2Click}
        >
          버튼 2
        </button>
      </div>
    )}
  </div>
</div>

  );
}
