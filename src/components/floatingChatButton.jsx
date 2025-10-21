import chatIcon from "../assets/images/chatIco.svg";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../store/userStore";

export default function FloatingChatButton() {
    const navigate = useNavigate();
    const { nickname } = UserStore();
    
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
                className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center group"
                onClick={() => handleNavigation("/chat")}
            >
                <img 
                    src={chatIcon} 
                    alt="chat" 
                    className="w-7 h-7 filter brightness-0 invert"
                />
            </button>
        </div>
    );
}