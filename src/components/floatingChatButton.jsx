import { useEffect } from "react";
import chatIcon from "../assets/images/chatIco.svg";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../store/userStore";
import useUnreadSSE from "../hooks/useUnreadSSE";
import useUnreadStore from "../store/useUnreadStore";
import { getUnreadChatCount } from "../api/notification";

export default function FloatingChatButton() {
    const navigate = useNavigate();
    const { nickname, memberId } = UserStore();
    const { unreadChatCount, setUnreadChatCount } = useUnreadStore();
    useUnreadSSE();

    useEffect(() => {
        // 로그인한 사용자에게만 API 호출
        if (!memberId) {
            return;
        }

        const fetchInitialData = async () => {
            try {
              const chatCountResponse = await getUnreadChatCount();
              // 응답 구조: { code: 200, message: "...", result: 1 }
              const chatCount = chatCountResponse?.result || 0;
              setUnreadChatCount(chatCount);
            //   console.log('✅ FloatingChatButton - 채팅 개수 로드:', chatCount);
            } catch (error) {
              console.error('채팅 개수 로드 실패:', error);
            }
          };
      
          fetchInitialData();
        }, [memberId, setUnreadChatCount]);
    
        
    const handleNavigation = (path) => {
        navigate(path);
    };

    if (!nickname) {
        return null;
    }

   
    return (
        <div className="fixed bottom-10 right-10 z-50">
            <button 
                className={`w-14 h-14 bg-blue-main rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center group relative`}
                onClick={() => handleNavigation("/chat")}
            >
                <img 
                    src={chatIcon} 
                    alt="chat" 
                    className="w-7 h-7 filter brightness-0 invert"
                />
                {/* 읽지 않은 메시지가 있을 때 빨간 점 표시 */}
                {unreadChatCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        
                    </div>
                )}
            </button>
            
        </div>
    );
}