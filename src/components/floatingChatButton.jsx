import { useEffect } from "react";
import chatIcon from "../assets/images/chatIco.svg";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../store/userStore";
import useUnreadSSE from "../hooks/useUnreadSSE";
import useUnreadStore from "../store/useUnreadStore";
import { getNotifications } from "../api/notification";

export default function FloatingChatButton() {
    const navigate = useNavigate();
    const { nickname } = UserStore();
    const { unreadCount, setUnreadCount, setNotifications } = useUnreadStore();
    useUnreadSSE();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
              const [notificationData] = await Promise.all([
                getNotifications(),
              ]);
      
              setNotifications(notificationData.notifications);
            } catch (error) {
              console.error('알림 초기 로드 실패:', error);
            }
          };
      
          fetchInitialData();
        }, [setUnreadCount, setNotifications]);
        
    const handleNavigation = (path) => {
        navigate(path);
    };

    // 로그인하지 않은 경우 버튼을 렌더링하지 않음
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
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        
                    </div>
                )}
            </button>
        </div>
    );
}