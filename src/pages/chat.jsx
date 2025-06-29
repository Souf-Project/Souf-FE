import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import ChatEmpty from "../components/chat/chatEmpty";
import ChatMessage from "../components/chat/chatMessage";
import { useQuery } from "@tanstack/react-query";
import { getChat } from "../api/chat";

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  
  // 임시 채팅 데이터
  const chatList = [
    {
      id: 1,
      name: "김시은",
      lastMessage: "안녕하세요, 프로젝트에 대해 문의드립니다.",
      time: "10:30",
      unread: 2,
    },
    {
      id: 2,
      name: "이지원",
      lastMessage: "네, 알겠습니다.",
      time: "09:15",
      unread: 0,
    },
    {
      id: 3,
      name: "박민수",
      lastMessage: "포트폴리오 확인했습니다.",
      time: "어제",
      unread: 1,
    },
  ];

    const {
    data: chatData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chatList"],
    queryFn: async () => {
      const data = await getChat();
      
      console.log("채팅 조회:", data);
      return data;
    },
    keepPreviousData: true,
  });

  /*
  {
        "roomId": 2,
        "opponentNickname": "1st테스트",
        "opponentProfileImageUrl": null,
        "lastMessage": "안녕하세요! \uD83D\uDC4B",
        "lastMessageTime": "2025-06-25T02:53:19.841245",
        "unreadCount": 0
    }


  
  */
  return (
    <div className="h-[calc(100vh-64px-80px)] px-6 ">
      <div className="w-screen mx-auto h-full">
        <div className="bg-white rounded-lg shadow-sm h-full">
          <div className="grid grid-cols-12 h-full">
            {/* 채팅 목록 */}
            <div className="col-span-4 bg-yellow-main">
              <div className="flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold ">SouF 채팅</h1>
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSubmit={handleSearch}
                  placeholder="검색어를 입력하세요"
                />
              </div>
              <div className="bg-white mx-4 rounded-2xl overflow-y-auto h-[calc(600px-80px)] ">
                {chatData.map((chat) => (
                  <div
                    key={chat.id}
                    className={`px-6 py-4 cursor-pointer hover:bg-gray-300 ${
                      selectedChat === chat.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{chat.name}</span>
                      <span className="text-sm text-gray-500">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="bg-yellow-point text-white text-xs px-2 py-1 rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 채팅 내용 */}
            <div className="col-span-8">
              {selectedChat ? (
                <ChatMessage
                  chatUsername={
                    chatList.find((chat) => chat.id === selectedChat)?.name
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
