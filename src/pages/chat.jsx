import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ChatEmpty from "../components/chat/chatEmpty";
import ChatMessage from "../components/chat/chatMessage";
import { useQuery } from "@tanstack/react-query";
import { getChat } from "../api/chat";
import { getFormattedDate } from "../utils/getDate";
import { patchChatRooms } from "../api/chat";
import SouFLogo from "../assets/images/SouFLogo.png";
import Loading from "../components/loading";


export default function Chat() {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [clickRoomId, setClickRoomId] = useState(-1);
  //const [nowCount,setNowCount] = useState(fal);
  // const VITE_S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

  // 이미지 URL인지 확인하는 함수
  const isImageMessage = (message) => {
    if (!message) return false;
    
    // 이미지 파일 확장자 확인
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    const hasImageExtension = imageExtensions.some(ext => message.toLowerCase().includes(ext));
    
    // HTTP URL이면서 이미지 관련 키워드 확인
    const isHttpUrl = message.startsWith('http://') || message.startsWith('https://');
    const hasImageKeyword = message.includes('image') || message.includes('img') || message.includes('photo');
    
    return hasImageExtension || (isHttpUrl && hasImageKeyword);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

    const {
    data: chatData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chatList"],
    queryFn: async () => {
      const data = await getChat();
      
      console.log("채팅 조회:", data);
      setChatList(data);
      return data;
    },
    keepPreviousData: true,
  });

    const handleChat = (roomId) => {
      setSelectedChat(roomId);
      setChatList((prevList) =>
      prevList.map((chat) =>
        chat.roomId === roomId ? { ...chat, unreadCount: 0 } : chat
      )
  );
      patchChatRooms(roomId);
    }

    // useEffect(() => {
    //   chatData;
    // } ,[selectedChat])

    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500">채팅 목록을 불러오는데 실패했습니다.</div>
        </div>
      );
    }

  return (
    <div className="h-[calc(100vh-64px)] px-6 ">
      <div className="w-screen mx-auto h-full">
        <div className="bg-white rounded-lg shadow-sm h-full">
          <div className="grid grid-cols-12 h-full">
            {/* 채팅 목록 */}
            <div className="col-span-4 bg-yellow-main h-full">
              <div className="flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold ">SouF 채팅</h1>
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSubmit={handleSearch}
                  placeholder="검색어를 입력하세요"
                />
              </div>
              <div className="bg-white mx-4 rounded-2xl overflow-y-auto h-[calc(600px-0px)] ">
                {chatList?.map((chat,i) => (
                  <div
                  key={i} 
                  className={`flex flex-row justify-start items-center pl-6 w-full ${selectedChat === chat.roomId ? "bg-gray-50" : ""
                      }`}>
                    <img
                      src={`${chat.opponentProfileImageUrl ? `${chat.opponentProfileImageUrl}` : SouFLogo}`}
                      className="w-10 h-10 rounded-[100%]"
                    />
                    <div
                      key={chat.roomId}
                      className="px-6 py-4 cursor-pointer w-full"
                      onClick={() => handleChat(chat.roomId)}
                    >
                      <div className="flex justify-between items-center mb-2 w-full">
                        <span className="font-semibold">{chat.opponentNickname}</span>
                        <span className="text-sm text-gray-500">{chat.lastMessageTime ? getFormattedDate(chat.lastMessageTime) : ""}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-600 truncate">
                          {isImageMessage(chat.lastMessage) ? "사진을 보냈습니다" : chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="bg-yellow-point text-white text-xs px-2 py-1 rounded-full">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 채팅 내용 */}
            <div className="col-span-8 overflow-y-auto h-[calc(100vh-64px-10px)]">
              {selectedChat ? (
                <ChatMessage
                  roomId={selectedChat}
                  chatNickname={
                    chatList.find((chat) => chat.roomId === selectedChat)?.opponentNickname
                  }
                  opponentProfileImageUrl={
                    chatList.find((chat) => chat.roomId === selectedChat)?.opponentProfileImageUrl
                  }
                  opponentId={
                    chatList.find((chat) => chat.roomId === selectedChat)?.opponentId
                  }
                  opponentRole={
                    chatList.find((chat) => chat.roomId === selectedChat)?.opponentRole
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ChatEmpty />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
