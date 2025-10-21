import { useState, useRef } from "react";
import PageHeader from "../components/pageHeader";
import SEO from "../components/seo";
import { useNavigate } from "react-router-dom";
import guide_bg from "../assets/images/guidePage/guide_bg.png";
import guide1_1 from "../assets/images/guidePage/guide1_1.png";
import guide1_2 from "../assets/images/guidePage/guide1_2.png";

export default function Guide() {
    const [activeTab, setActiveTab] = useState(0);
    const [activeGuideTab, setActiveGuideTab] = useState(0);
    const [activeFeatureTab, setActiveFeatureTab] = useState(0);
    const navigate = useNavigate();
    
    // 각 세션에 대한 ref
    const chatSectionRef = useRef(null);
    const memberSectionRef = useRef(null);
    const reviewSectionRef = useRef(null);
    
    const handleSearch = (e) => {
        e.preventDefault();
        console.log(e.target.value);
    };
    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
    };
    const handleGuideTabChange = (tabIndex) => {
        setActiveGuideTab(tabIndex);
    };
    const handleFeatureTabChange = (tabIndex) => {
        setActiveFeatureTab(tabIndex);
    };
    
    // 스크롤 함수들
    const scrollToChat = () => {
        const element = chatSectionRef.current;
        if (element) {
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - 120; // 헤더 + sticky 높이만큼 위로
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };
    const scrollToMember = () => {
        const element = memberSectionRef.current;
        if (element) {
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - 120;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };
    const scrollToReview = () => {
        const element = reviewSectionRef.current;
        if (element) {
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - 120;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div>
            <SEO title="이용 가이드" description={`스프 SouF - 이용 가이드`} subTitle='스프' />
            <PageHeader
                leftButtons={[
                    { text: "이용 가이드", onClick: () => navigate("/guide") }
                ]}
                showDropdown={false}
                showSearchBar={true}
                searchPlaceholder="검색어를 입력하세요"
                onSearch={handleSearch}
            />
            <div className="relative w-full">
                <img src={guide_bg} alt="guide_bg" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                    <div>
                        <h1 className="text-4xl font-extrabold">인재를 빠르게<br/>외주를 알맞게</h1>
                        <p className="text-3xl font-semibold mt-4">대학생 프리랜서 플랫폼</p>
                        <p className="text-3xl font-semibold">스프</p>
                    </div>
                </div>
            </div>
            <div className="w-full sticky top-16 bg-white z-10 mx-auto border-b border-gray-200 py-6">
                <div className="w-full max-w-[40rem] mx-auto flex justify-between">
                    <button 
                        className="text-sm font-semibold text-neutral-500 hover:text-blue-main transition-colors duration-200"
                        onClick={scrollToChat}
                    >
                        채팅
                    </button>
                    <button 
                        className="text-sm font-semibold text-neutral-500 hover:text-blue-main transition-colors duration-200"
                        onClick={scrollToMember}
                    >
                        회원 구분
                    </button>
                    <button 
                        className="text-sm font-semibold text-neutral-500 hover:text-blue-main transition-colors duration-200"
                        onClick={scrollToReview}
                    >
                        후기
                    </button>
                </div>

            </div>
            <div className="w-full border-b border-gray-500 py-6" ref={chatSectionRef}>
             <div className="w-full max-w-[60rem] mx-auto flex flex-col justify-center items-center pb-40">
              <h1 className="text-2xl font-bold mt-20">협의는 빠르게, 기록은 깔끔하게</h1>
              <h2 className="text-base font-medium mt-4">1:1 채팅을 통해 외주 프로젝트를 진행하세요.</h2>
              <div className="w-full flex justify-between mt-10">
                <div className="flex flex-col gap-6">
                    <p className="text-blue-600 text-2xl font-bold">빠르고 쉽게 인재 컨택</p>
                    <p className="text-sm font-medium">쉽게 공고를 등록하고, <br/>여러 지원자를 확보하세요.<br/></p>
                    <p className="text-sm font-medium">지원자들과 컨택하여,<br/>빠르게 프로젝트에 대한 매칭을 성공하세요!</p>

                    <p className="text-blue-600 text-2xl font-bold">계약서로 안전한 거래</p>
                    <p className="text-sm font-medium">아직도 불안한 외주 작업하고 계신가요?</p>
                    <p className="text-sm font-medium">작업하고 돈을 못 받는 경우와<br/>퀄리티 낮은 결과물과 납기 기한 못맞추는 경우가 대다수 😫</p>

                    <span className="text-lg font-bold">스프의 계약서로 <span className="text-blue-600">안전하고 빠르게</span> 계약을 성사시켜보세요!</span>
                </div>
                <div>
                    <img src={guide1_1} alt="guide1_1" />
                </div>
                
              </div>
              <p className="w-full text-sm font-medium text-left mt-10 border-l-2 border-black pl-4">SouF의 채팅과 내부 표준 계약서를 활용하여 작성하는 것을 권장합니다.<br/>
              SouF는 표준 계약·정산 절차 외에서 이루어진 거래에 대해 법적 책임을 부담하지 않으며, 분쟁 시 지원이 어렵습니다.</p>
            
                </div>
            </div>
            <div className="w-full border-b border-gray-500 py-6 bg-[#F8F8F8]" ref={memberSectionRef}>
             <div className="w-full max-w-[60rem] mx-auto flex flex-col justify-center items-center pb-40">
              <h1 className="text-2xl font-bold mt-20">누가 무엇을 할 수 있나요?</h1>
              <h2 className="text-base font-medium mt-4">SouF는 역할에 따라 보이는 메뉴와 가능한 기능이 달라집니다.</h2>
              <div className="flex border-b border-gray-200 w-full justify-center mt-4">
                    <button
                        className={`relative w-1/2 py-6 text-lg font-bold transition-colors duration-200 relative group ${
                            activeTab === 0 ? "text-blue-600" : "text-gray-700"
                        }`}
                        onClick={() => handleTabChange(0)}
                    >
                        <span>대학생(프리랜서)</span>
                        <span
                            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[2px] bg-black transition-all duration-300 ease-out ${
                                activeTab === 0 ? "w-full" : "w-0 group-hover:w-1/3"
                            }`}
                        ></span>
                    </button>
                    <button
                        className={`w-1/2 py-6 text-lg font-bold transition-colors duration-200 relative group ${
                            activeTab === 1 ? "text-blue-600" : "text-gray-700"
                        }`}
                        onClick={() => handleTabChange(1)}
                    >
                        <span>의뢰자(프리랜서 구인)</span>
                        <span
                            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[2px] bg-black transition-all duration-300 ease-out ${
                                activeTab === 1 ? "w-full" : "w-0 group-hover:w-1/3"
                            }`}
                        ></span>
                    </button>
                </div>

              <div className="w-full flex justify-between mt-10">
                {activeTab === 0 ? (
                  // 대학생(프리랜서) 탭 내용
                  <>
                <div className="flex flex-col gap-6">
                       <div 
                         className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
                           activeGuideTab === 0 
                             ? "bg-white border border-sky-300 shadow-lg" 
                             : ""
                         }`}
                         onClick={() => handleGuideTabChange(0)}
                       >
                        <h2 className={`text-xl font-bold mb-8 transition-colors duration-300 ${
                          activeGuideTab === 0 ? "text-blue-600" : "text-black"
                        }`}>1. 포트폴리오 구성</h2>
                    <span className="text-neutral-500 text-base font-bold">본인의 모든 작업물을 업로드하고, SNS 피드를 구성해보세요!<br/>
                    스프에서는 <span className="text-black">포트폴리오</span>가 된답니다! (* 옆에 이미지를 참고하세요!)</span>
                   </div>
                       <div 
                         className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
                           activeGuideTab === 1 
                             ? "bg-white border border-sky-300 shadow-lg" 
                             : ""
                         }`}
                         onClick={() => handleGuideTabChange(1)}
                       >
                        <h2 className={`text-xl font-bold mb-8 transition-colors duration-300 ${
                          activeGuideTab === 1 ? "text-blue-600" : "text-black"
                        }`}>2. 공고 지원</h2>
                        <span className="text-neutral-500 text-base font-bold">내 전공에 맞는 공고문에 지원해보세요!<br/>실제 지원하게 되면 옆에 이미지 처럼 지원하게 되어요! <br/>*(프로필 보이는 거 사진 첨부)</span>
                       </div>
                       <div 
                         className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
                           activeGuideTab === 2 
                             ? "bg-white border border-sky-300 shadow-lg" 
                             : ""
                         }`}
                         onClick={() => handleGuideTabChange(2)}
                       >
                        <h2 className={`text-xl font-bold mb-8 transition-colors duration-300 ${
                          activeGuideTab === 2 ? "text-blue-600" : "text-black"
                        }`}>3. 채팅/협의</h2>
                        <span className="text-neutral-500 text-base font-bold">공고 의뢰자의 채팅을 기다리고, 컨택된다면<br/>매너있게 채팅해보세요!  알맞은 견적과 기간을 안내하세요!</span>
                       </div>
                       <div 
                         className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
                           activeGuideTab === 3 
                             ? "bg-white border border-sky-300 shadow-lg" 
                             : ""
                         }`}
                         onClick={() => handleGuideTabChange(3)}
                       >
                        <h2 className={`text-xl font-bold mb-8 transition-colors duration-300 ${
                          activeGuideTab === 3 ? "text-blue-600" : "text-black"
                        }`}>4. 맞춤 공고 알람</h2>
                        <span className="text-neutral-500 text-base font-bold">관심분야를 설정하고, 내 관심분야의 외주가 등록되면<br/>알림을 받아보세요!</span>
                       </div>
                    </div>
                    <div className="w-1/2 ">
                       <div className={`p-4 w-full h-full rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                         activeGuideTab === 0 ? "bg-blue-100" :
                         activeGuideTab === 1 ? "bg-blue-200" :
                         activeGuideTab === 2 ? "bg-blue-300" :
                         activeGuideTab === 3 ? "bg-blue-400" :
                         "bg-gray-100"
                       }`}/>
                    </div>
                  </>
                ) : (
                  // 의뢰자(프리랜서 구인) 탭 내용
                  <>
                    <div className="flex flex-col gap-6">
                       <div 
                         className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
                           activeGuideTab === 0 
                             ? "bg-white border border-sky-300 shadow-lg" 
                             : ""
                         }`}
                         onClick={() => handleGuideTabChange(0)}
                       >
                        <h2 className={`text-xl font-bold mb-8 transition-colors duration-300 ${
                          activeGuideTab === 0 ? "text-blue-600" : "text-black"
                        }`}>1. 외주 공고 작성</h2>
                        <span className="text-neutral-500 text-base font-bold">원하는 조건으로 대학생 프리랜서를 구해보세요.<br/>
                        스프에서는 <span className="text-black">견적받기</span>를 지원합니다!</span>
                       </div>
                       <div 
                         className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
                           activeGuideTab === 1 
                             ? "bg-white border border-sky-300 shadow-lg" 
                             : ""
                         }`}
                         onClick={() => handleGuideTabChange(1)}
                       >
                        <h2 className={`text-xl font-bold mb-8 transition-colors duration-300 ${
                          activeGuideTab === 1 ? "text-blue-600" : "text-black"
                        }`}>2. 지원자 검토</h2>
                        <span className="text-neutral-500 text-base font-bold">내가 올린 공고에 지원한 지원자를 확인해보세요!<br/>
                        지원자의 포트폴리오를 확인하고, 적합한 인재를 선택해보세요!</span>
                   </div>
                       <div 
                         className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
                           activeGuideTab === 2 
                             ? "bg-white border border-sky-300 shadow-lg" 
                             : ""
                         }`}
                         onClick={() => handleGuideTabChange(2)}
                       >
                        <h2 className={`text-xl font-bold mb-8 transition-colors duration-300 ${
                          activeGuideTab === 2 ? "text-blue-600" : "text-black"
                        }`}>3. 채팅/협의</h2>
                        <span className="text-neutral-500 text-base font-bold">지원자의 채팅을 기다리고, 컨택된다면<br/>매너있게 채팅해보세요! 알맞은 견적과 기간을 안내하세요!</span>
                   </div>
                       <div 
                         className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
                           activeGuideTab === 3 
                             ? "bg-white border border-sky-300 shadow-lg" 
                             : ""
                         }`}
                         onClick={() => handleGuideTabChange(3)}
                       >
                        <h2 className={`text-xl font-bold mb-8 transition-colors duration-300 ${
                          activeGuideTab === 3 ? "text-blue-600" : "text-black"
                        }`}>4. 계약</h2>
                        <span className="text-neutral-500 text-base font-bold">원하는 지원자와 함께 계약하세요!<br/>
                        스프에서 제공하는 계약서를 사용해 간편하게 계약하세요.</span>
                   </div>
                </div>
                <div className="w-1/2 ">
                       <div className={`p-4 w-full h-full rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                         activeGuideTab === 0 ? "bg-green-100" :
                         activeGuideTab === 1 ? "bg-green-200" :
                         activeGuideTab === 2 ? "bg-green-300" :
                         activeGuideTab === 3 ? "bg-green-400" :
                         "bg-gray-100"
                       }`}/>
                </div>
                  </>
                )}
                
              </div>
                </div>
            </div>
            <div className="w-full" ref={reviewSectionRef}>
             <div className="w-full max-w-[60rem] mx-auto flex flex-col justify-center items-center">
              <h1 className="text-2xl font-bold mt-20">신뢰는 투명한 피드백에서 자랍니다.</h1>
              <h2 className="text-zinc-500 text-base font-semibold mt-4">스프는 후기 중심의 투명한 중개 플랫폼입니다.</h2>
              <h2 className="text-zinc-500 text-base font-semibold">모든 거래와 협업은 검증된 피드백을 기반으로 이루어집니다.</h2>
             <h2 className="text-zinc-500 text-base font-semibold">신뢰는 곧 우리의 경쟁력입니다.</h2>
              <h2 className="text-zinc-500 text-base font-semibold">*스프 온도와 계약서 체결의 중개로 더욱 투명한 거래를 지향합니다.</h2>

               <div className="w-2/3 flex justify-between mt-10">
                 <div 
                   className="flex flex-col items-center justify-center font-semibold rounded-lg cursor-pointer"
                   onClick={() => handleFeatureTabChange(0)}
                 >
                     <svg className={`w-8 h-8 mb-2 ${activeFeatureTab === 0 ? 'text-blue-main' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                     </svg>
                     <p className={activeFeatureTab === 0 ? 'text-black' : 'text-zinc-500' } >스프 온도</p>
                 </div>
                 <div 
                   className="flex flex-col items-center justify-center font-semibold rounded-lg cursor-pointer"
                   onClick={() => handleFeatureTabChange(1)}
                 >
                     <svg className={`w-8 h-8 mb-2 transition-all duration-300 ease-in-out ${activeFeatureTab === 1 ? 'text-blue-main' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                     </svg>
                     <p className={activeFeatureTab === 1 ? 'text-black' : 'text-zinc-500'}>메인 홍보</p>
                 </div>
                 <div 
                   className="flex flex-col items-center justify-center font-semibold rounded-lg cursor-pointer"
                   onClick={() => handleFeatureTabChange(2)}
                 >
                     <svg className={`w-8 h-8 mb-2 transition-all duration-300 ease-in-out ${activeFeatureTab === 2 ? 'text-blue-main' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                         <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V7h10v2z"/>
                     </svg>
                     <p className={activeFeatureTab === 2 ? 'text-black' : 'text-zinc-500'}>저장</p>
                 </div>
                 <div 
                   className="flex flex-col items-center justify-center font-semibold rounded-lg cursor-pointer"
                   onClick={() => handleFeatureTabChange(3)}
                 >
                     <svg className={`w-8 h-8 mb-2 transition-all duration-300 ease-in-out ${activeFeatureTab === 3 ? 'text-blue-main' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                         <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                     </svg>
                     <p className={activeFeatureTab === 3 ? 'text-black' : 'text-zinc-500'}>계약서</p>
                 </div>
                 <div 
                   className="flex flex-col items-center justify-center font-semibold rounded-lg cursor-pointer transition-all duration-300 ease-in-out"
                   onClick={() => handleFeatureTabChange(4)}
                 >
                     <svg className={`w-8 h-8 mb-2 transition-all duration-300 ease-in-out ${activeFeatureTab === 4 ? 'text-blue-main' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                         <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                     </svg>
                     <p className={activeFeatureTab === 4 ? 'text-black' : 'text-zinc-500'}>지원/컨택</p>
                 </div>
              </div>
               <div className={`w-full h-[30rem] mx-auto mt-16 transition-all duration-300 ease-in-out ${
                 activeFeatureTab === 0 ? "bg-blue-100" :
                 activeFeatureTab === 1 ? "bg-green-100" :
                 activeFeatureTab === 2 ? "bg-yellow-100" :
                 activeFeatureTab === 3 ? "bg-purple-100" :
                 activeFeatureTab === 4 ? "bg-pink-100" :
                 "bg-gray-100"
               }`} />
                </div>
               
            </div>
        </div>
    );
}