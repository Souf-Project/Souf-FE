import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SEO from "../components/seo";
import Pageheader from "../components/pageHeader";
import FAQcontent from "../components/cs/FAQcontent";
import InquiryCenter from "../components/cs/inquiryCenter";
import AlertModal from "../components/alertModal";
import { UserStore } from "../store/userStore";

export default function CsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { memberId } = UserStore();
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isInquiryCompleted, setIsInquiryCompleted] = useState(false);
    
    // URL 쿼리 파라미터에서 탭 정보 읽기
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab');
        if (tab === 'inquiry') {
            // 문의 센터는 로그인이 필요하므로 확인
            if (!memberId) {
                setShowLoginModal(true);
                setActiveTab(0); // 로그인 안되어 있으면 FAQ로
            } else {
                setActiveTab(1);
            }
        } else {
            setActiveTab(0); // 기본값은 FAQ
        }
    }, [location.search, memberId]);
    
    const handleTabChange = (tab) => {
        if (tab === 1 && !memberId) {
            setShowLoginModal(true);
            return;
        }
        setActiveTab(tab);
        setIsInquiryCompleted(false);
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
            <div className="flex items-center gap-4 justify-center md:justify-start">
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
                {isInquiryCompleted ? (
                    <div className="flex flex-col items-start py-20">
                        <div className="">
                           
                            <p className="text-lg md:text-2xl ml-4 md:ml-0 font-bold text-blue-500 mb-2">문의가 접수되었습니다.
                           </p>
                            <p className="text-lg md:text-2xl ml-4 md:ml-0 font-bold text-blue-500 mb-6"> 마이페이지에서 확인하세요.</p>
                            {/* <button
                                onClick={() => {
                                    setIsInquiryCompleted(false);
                                    setActiveTab(0);
                                }}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            >
                                FAQ로 돌아가기
                            </button> */}
                        </div>
                    </div>
                ) : activeTab === 0 ? (
                    <FAQcontent onInquiryClick={() => handleTabChange(1)} />
                ) : (
                    <InquiryCenter onInquiryComplete={() => setIsInquiryCompleted(true)} />
                )}
            </div>
            
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