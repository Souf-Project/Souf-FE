import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SEO from "../components/seo";
import Pageheader from "../components/pageHeader";
import FAQcontent from "../components/cs/FAQcontent";
import InquiryCenter from "../components/cs/inquiryCenter";
import AlertModal from "../components/alertModal";
import { UserStore } from "../store/userStore";

export default function CsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { memberId } = UserStore();
    
    const handleTabChange = (tab) => {
        // 문의 센터로 이동하려고 할 때 로그인 상태 확인
        if (tab === 1 && !memberId) {
            setShowLoginModal(true);
            return;
        }
        setActiveTab(tab);
    };
   
  
  return (
    <div>
        <SEO  title="고객센터" description={`스프 SouF - 고객센터`} subTitle='스프' />
        <Pageheader
            leftButtons={[
                { text: "고객센터", onClick: () => navigate("/guide") }
            ]}
           
        />
        <div className="w-full max-w-[60rem] mx-auto flex flex-col gap-4 pb-40">
            <div className="flex items-center gap-4">
                <button
                        className={`pr-8 py-2 text-lg font-bold transition-colors duration-200 relative group ${
                            activeTab === 0 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(0)}
                    >
                        <span>FAQ</span>
                        {/* <span
                            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[3px] bg-blue-main transition-all duration-300 ease-out ${
                                activeTab === 0 ? "w-24" : "w-0 group-hover:w-2/3"
                            }`}
                        ></span> */}
                    </button>
                    <button
                        className={`px-6 py-2 text-lg font-bold transition-colors duration-200 relative group ${
                            activeTab === 1 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(1)}
                    >
                        <span>문의 센터</span>
                        {/* <span
                            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[3px] bg-blue-main transition-all duration-300 ease-out ${
                                activeTab === 1 ? "w-3/4" : "w-0 group-hover:w-2/3"
                            }`}
                        ></span> */}
                    </button>
            </div>
           
            <div>
                {activeTab === 0 ? <FAQcontent onInquiryClick={() => handleTabChange(1)} /> : <InquiryCenter />}
            </div>
            
            {/* 로그인 필요 모달 */}
            {showLoginModal && (
                <AlertModal
                    type="simple"
                    title="로그인이 필요합니다"
                    description="문의 센터를 이용하려면 로그인이 필요합니다."
                    TrueBtnText="로그인하러 가기"
                    FalseBtnText="취소"
                    onClickTrue={() => {
                        setShowLoginModal(false);
                        navigate("/login");
                    }}
                    onClickFalse={() => setShowLoginModal(false)}
                />
            )}
        </div>
    </div>
  );
}