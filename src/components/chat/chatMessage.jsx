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
import AlertModal from "../alertModal";
import DegreeModal from "../degreeModal";

export default function ChatMessage({ chatNickname,roomId, opponentProfileImageUrl }) {
    const { nickname } = UserStore();
  const [newMessage, setNewMessage] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [showButtonList, setShowButtonList] = useState(false);
  const scrollRef = useRef(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showDegreeModal, setShowDegreeModal] = useState(false);

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
    setShowButtonList(false);
  };

  const handleButton2Click = () => {
    console.log("버튼 2 클릭");
    setShowButtonList(false);
  };

  const handleButton3Click = () => {
    console.log("버튼 3 클릭");
    setShowAlertModal(true);
    setShowButtonList(false);
  };

  const handleDegreeModalClick = () => {
    setShowAlertModal(false);
    setShowDegreeModal(true);
    setShowButtonList(false);
  };

  return (
   <div className="h-full flex flex-col">
  {/* 채팅 헤더 */}
  <div className="p-4 border-b border-gray-200">
    <h2 className="font-semibold">{chatNickname}</h2>
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
        <button 
          className="bg-blue-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
          onClick={handleButton1Click}
        >
          버튼 1
        </button>
        <button 
          className="bg-green-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
          onClick={handleButton2Click}
        >
          버튼 2
        </button>
        <button 
          className="bg-yellow-300 text-white px-6 py-4 rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200"
          onClick={handleButton3Click}
        >
          SouF 온도 남기기 
        </button>
      </div>
    )}
    {showAlertModal && (
      <AlertModal
        type="simple"
        title="SouF 온도 남기기"
        description={`SouF 온도를 남기시겠습니까?\n온도를 남기시면 거래가 자동으로 완료 처리됩니다.`}
        onClickTrue={() => handleDegreeModalClick()}
        onClickFalse={() => setShowAlertModal(false)}
        FalseBtnText="취소"
        TrueBtnText="확인"
      />
    )}
    {showDegreeModal && (
      <DegreeModal
        title="SouF 온도 평가"
        description="이번 거래에 대한 만족도를 평가해주세요"
        bottomText="별점을 선택해주세요"
        FalseBtnText="취소"
        TrueBtnText="확인"
        onClickFalse={() => setShowDegreeModal(false)}
        onClickTrue={() => {
          console.log("온도 평가 확인");
          setShowDegreeModal(false);
        }}
      />
    )}
  </div>
</div>

  );
}
