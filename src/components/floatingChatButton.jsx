import chatIcon from "../assets/images/chatIco.svg";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../store/userStore";
import useUnreadStore from "../store/useUnreadStore";

export default function FloatingChatButton() {
    const navigate = useNavigate();
    const { nickname } = UserStore();
    const { unreadCount } = useUnreadStore();
    
    const handleNavigation = (path) => {
        navigate(path);
    };

    // 로그인하지 않은 경우 버튼을 렌더링하지 않음
    if (!nickname) {
        return null;
    }

    // unreadCount가 0보다 크면 빨간색, 아니면 파란색
    const buttonColor = unreadCount > 0 
        ? "bg-red-500 hover:bg-red-600" 
        : "bg-blue-500 hover:bg-blue-600";

    return (
        <div className="fixed bottom-10 right-10 z-50">
            <button 
                className={`w-14 h-14 ${buttonColor} rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center group relative`}
                onClick={() => handleNavigation("/chat")}
            >
                <img 
                    src={chatIcon} 
                    alt="chat" 
                    className="w-7 h-7 filter brightness-0 invert"
                />
                {/* 읽지 않은 메시지가 있을 때 빨간 점 표시 */}
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </div>
                )}
            </button>
        </div>
    );
}