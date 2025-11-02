import {React, useRef} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatIcon from "../assets/images/chatIco.svg";
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import { Link } from "react-router-dom";
import { UserStore } from "../store/userStore";
import SOUFLogo from "../assets/images/SouFLogo.svg";
import backArrow from "../assets/images/backArrow.svg";
import AlertModal from "./alertModal";

export default function Header() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userType, setUserType] = useState("");
  const [userName, setUserName] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showFeedAlertModal, setShowFeedAlertModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 개별 드롭다운 상태
  const { nickname, roleType, memberId } = UserStore();
  //const username = UserStore((state) => state.username);
  //const roleType = UserStore((state) => state.roleType);
  //const memberId = UserStore((state) => state.memberId);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const mobileMenuRef = useRef(null);
  const headerRef = useRef(null);



  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const location = useLocation();
  const query = useQuery();
  const categoryFromQuery = query.get("category");

  useEffect(() => {
    if (memberId) {
      setIsLogin(true);
      setUserType(roleType || "");
      setUserName(nickname || "");
    } else {
      setIsLogin(false);
      setUserType("");
      setUserName("");
    }
  }, [memberId, roleType, nickname]);

  useEffect(() => {
    // /recruit 경로 & 카테고리 쿼리 파라미터가 있는 경우만
    if (location.pathname === "/recruit" && categoryFromQuery) {
      setActiveCategory(categoryFromQuery);
    } else if (location.pathname === "/recruit" && !categoryFromQuery) {
      // /recruit 경로지만 카테고리가 없는 경우는 카테고리 선택 없음
      setActiveCategory("");
    } else if (location.pathname.includes("/recruitDetails/")) {
      setActiveCategory("");
    } else if (location.pathname === "/contests") {
      setActiveCategory("contests");
    }else if (location.pathname === "/recruitsAll") {
      setActiveCategory("recruitsAll");
    } else {
      setActiveCategory("");
    }
  }, [location.pathname, categoryFromQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

useEffect(() => {
  function handleClickOutside(event) {
    if (
      showMobileMenu &&
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target)
    ) {
      setShowMobileMenu(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showMobileMenu]);


  const handleNavigation = (path) => {
    navigate(path);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const checkRecruitUploadAccess = () => {
    if (!memberId) {
      setShowAlertModal(true);
      return false;
    }
    if (roleType !== "MEMBER" && roleType !== "ADMIN") {
      setShowAlertModal(true);
      return false;
    }
    return true;
  };

  const checkFeedUploadAccess = () => {
    if (!memberId) {
      setShowFeedAlertModal(true);
      return false;
    }
    if (roleType !== "STUDENT" && roleType !== "ADMIN") {
      setShowFeedAlertModal(true);
      return false;
    }
    return true;
  };

  const handleRecruitUploadClick = () => {
    if (checkRecruitUploadAccess()) {
      navigate("/recruitUpload");
    }
  };

  const handleNavigationCategory = () => {
    navigate(`/recruit`);
    setShowMobileMenu(false);
  };

  const handleNavigationStudentList = () => {
    navigate(`/feed`);
    setShowMobileMenu(false);
  };

  const handleNavigationFeedList = () => {
    navigate(`/studentFeedList`);
    setShowMobileMenu(false);
  };

  const handleNavigationFeedUpload = () => {
    if (checkFeedUploadAccess()) {
      navigate(`/postUpload`);
      setShowMobileMenu(false);
    }
  };
  const handleNavigationGuideCategory = () => {
    navigate(`/guide`);
    setShowMobileMenu(false);
  };
  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const toggleLogin = () => {
    UserStore.getState().clearUser();
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user-storage");

  deleteCookie("refreshToken");


    setIsLogin(false);
    setShowUserMenu(false);
    setShowMobileMenu(false);
    
    navigate("/");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleMobileMenu = () => {
    setMenuAnimating(true);
    setShowMobileMenu((prev) => !prev);
  };

  const handleHeaderMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleHeaderMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleDropdownEnter = (dropdownType) => {
    setActiveDropdown(dropdownType);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const categories = firstCategoryData.first_category;


  const UserTypeLabel = () => {
    if (roleType === "ADMIN") {
      return (
        <div className="flex items-center gap-2 text-white justify-center">
          <span className="font-bold">관리자</span>
          <span className="font-normal">{nickname}</span>
        </div>
      );
    } else if (roleType === "STUDENT") {
      return (
        <div className="flex items-center gap-2 text-white justify-center">
          <span className="font-bold">학생</span>
          <span className="font-normal">{nickname}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-white justify-center">

          <span className="font-bold">일반</span>
          <span className="font-normal">{nickname}</span>
        </div>
      );
    }
  };

  // PC 버전 헤더
const DesktopHeader = () => (
  <div 
    ref={headerRef}
    onMouseEnter={handleHeaderMouseEnter}
    onMouseLeave={handleHeaderMouseLeave}
    className="fixed top-0 left-0 z-50 w-screen"
  >
    <header className="bg-white shadow-md">
      <div className="relative flex items-center justify-between max-w-[60rem] mx-auto">
        <div className="flex items-center gap-x-8">
          <img src={SOUFLogo} alt="SouF" className="w-24 cursor-pointer" onClick={() => handleNavigation("/")}/>
          <ul className="flex items-center font-bold text-lg text-black cursor-pointer gap-1">
            <li 
              className={`relative py-5 flex items-center gap-1 w-36 ${location.pathname === "/recruitUpload" ? "text-orange-point" : ""}`}
              onMouseEnter={() => handleDropdownEnter('recruit')}
              onMouseLeave={handleDropdownLeave}
            >
              <span className="cursor-pointer">외주 의뢰하기<span className="text-[#FF8454] font-medium text-sm ml-2">★</span></span>
              {/* 외주 의뢰하기 드롭다운 */}
              {activeDropdown === 'recruit' && (
                 <div 
                   className="absolute top-[3rem] left-[-1.1rem] mt-2 pt-4 bg-white shadow-lg border border-gray-200 py-2 z-[-10] animate-slideDown"
                   onMouseEnter={() => handleDropdownEnter('recruit')}
                   onMouseLeave={handleDropdownLeave}
                 >
                   <ul className="flex flex-col gap-1">
                     <li><button onClick={handleRecruitUploadClick} className="w-full flex justify-center items-center px-4 py-2 text-sm text-gray-600 hover:text-orange-point transition-all duration-200 ">무료 외주 등록/제안</button></li>
                     <li><button onClick={() => {
                       if (checkRecruitUploadAccess()) {
                         navigate("/recruitUpload", { state: { estimateType: 'estimate' } });
                       }
                     }} className="w-full flex justify-center items-center px-4 py-2 text-sm text-gray-600 hover:text-orange-point transition-all duration-200 ">무료 외주 견적 받기</button></li>
                   </ul>
                 </div>
              )}
            </li>
            <li 
              className={`relative py-5 flex items-center gap-2 w-28 ${location.pathname === "/recruit" ? "text-orange-point" : ""}`}
              onMouseEnter={() => handleDropdownEnter('find')}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="flex items-center gap-1">
              <span className="cursor-pointer" onClick={() => navigate("/recruit")}>외주 찾기</span>
              <img src={backArrow} alt="backArrow" className="w-4 h-4 rotate-[270deg] ml-2" />
              </div>
             
              {/* 외주 찾기 드롭다운 */}
              {activeDropdown === 'find' && (
                 <div 
                   className="absolute top-[3rem] left-[-1.4rem] mt-2 pt-4 bg-white shadow-lg border border-gray-200 w-32 py-2 z-[-10] animate-slideDown"
                   onMouseEnter={() => handleDropdownEnter('find')}
                   onMouseLeave={handleDropdownLeave}
                 >
                   <ul className="flex flex-col gap-1">
                     <li><button onClick={() => handleNavigationCategory()} className="w-full flex justify-center items-center px-2 py-2 text-sm text-gray-600 hover:text-orange-point transition-all duration-200 ">카테고리별 외주</button></li>
                   </ul>
                 </div>
              )}
            </li>
            <li 
              className={`relative py-5 w-36 ${location.pathname === "/feed" ? "text-orange-point" : ""}`}
              onMouseEnter={() => handleDropdownEnter('feed')}
              onMouseLeave={handleDropdownLeave}
            >
              <span className="cursor-pointer" onClick={() => navigate("/feed")}>대학생 피드보기</span>
              {/* 대학생 피드보기 드롭다운 */}
              {activeDropdown === 'feed' && (
                 <div 
                   className="absolute top-[3rem] left-[-1rem] mt-2 pt-4 bg-white shadow-lg border border-gray-200 w-36 py-2 z-[-10] animate-slideDown"
                   onMouseEnter={() => handleDropdownEnter('feed')}
                   onMouseLeave={handleDropdownLeave}
                 >
                   <ul className="flex flex-col gap-1">
                     <li><button onClick={() => handleNavigationStudentList()} className="w-full flex justify-center items-center px-2 py-2 text-sm text-gray-600 hover:text-orange-point transition-all duration-200">대학생 리스트</button></li>
                     <li><button onClick={() => handleNavigationFeedList()} className="w-full flex justify-center items-center px-2 py-2 text-sm text-gray-600 hover:text-orange-point transition-all duration-200">카테고리별 피드</button></li>
                     <li><button onClick={() => handleNavigationFeedUpload()} className="w-full flex justify-center items-center px-2 py-2 text-sm text-gray-600 hover:text-orange-point transition-all duration-200">피드 등록하기</button></li>
                   </ul>
                 </div>
              )}
            </li>
            {/* <li 
              className={`flex items-center gap-1  ${location.pathname === "/review" ? "text-orange-point" : ""}`}
              onClick={() => navigate("/review")}
            >
              외주 후기<span className="text-[#FF8454] font-medium text-sm">★9.9</span>
            </li> */}
            {/* <li className="text-gray-400 font-medium mx-4">|</li> */}

            <li 
              className={`relative py-5 w-28 ${location.pathname === "/guide" ? "text-orange-point" : ""}`}
              onMouseEnter={() => handleDropdownEnter('guide')}
              onMouseLeave={handleDropdownLeave}
            >
              <span className="cursor-pointer" onClick={() => navigate("/guide")}>이용가이드</span>
              {/* 이용가이드 드롭다운 */}
                {activeDropdown === 'guide' && (
                 <div 
                   className="absolute top-[3rem] left-[-1.4rem] mt-2 pt-4 bg-white shadow-lg border border-gray-200 w-28 py-2 z-[-10] animate-slideDown"
                   onMouseEnter={() => handleDropdownEnter('guide')}
                   onMouseLeave={handleDropdownLeave}
                 >
                   <ul className="flex flex-col gap-1">
                     <li><button onClick={() => handleNavigationGuideCategory()} className="w-full flex justify-center items-center px-2 py-2 text-sm text-gray-600 hover:text-orange-point transition-all duration-200">고객센터</button></li>
                   </ul>
                 </div>
              )} 
               </li>

            

          </ul>
        </div>

        <div className="flex items-center gap-x-4">
          {memberId ? (
            // 로그인 상태
            
              <div className="relative user-menu-container">
                <button
                  className="text-white bg-blue-main min-w-36 py-2 w-full px-2 font-bold rounded-lg w-36 shadow-md"
                  onClick={toggleUserMenu}
                >
                  <UserTypeLabel />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-1 z-[999999] border border-gray-200">
                    <button
                      className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-blue-main"
                      onClick={() => handleNavigation("/mypage")}
                    >
                      마이페이지
                    </button>
                    {roleType === "ADMIN" && (
                      <>
                        <button
                          className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-blue-main"
                          onClick={handleRecruitUploadClick}
                        >
                          공고문 작성하기
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-blue-main"
                          onClick={() => handleNavigation("/postUpload")}
                        >
                          피드 작성하기
                        </button>
                      </>
                    )}
                    {roleType === "MEMBER" && (
                      <button
                        className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-blue-main"
                        onClick={handleRecruitUploadClick}
                      >
                        공고문 작성하기
                      </button>
                    )}
                    {roleType === "STUDENT" && (
                      <button
                        className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-blue-main"
                        onClick={() => handleNavigation("/postUpload")}
                      >
                        피드 작성하기
                      </button>
                    )}
                    <button
                      className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-blue-main"
                      onClick={toggleLogin}
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
          ) : (
            // 로그아웃 상태
            <>
              <div className="flex items-center text-lg font-bold gap-x-2">
                <button
                  className="w-20"
                  onClick={() => handleNavigation("/login")}
                >
                  로그인
                </button>
                <button
                  className="text-white bg-[#5185E6] px-6 py-3 font-bold rounded-xl whitespace-nowrap shadow-md"
                  onClick={() => handleNavigation("/join")}
                >
                  회원가입
                </button>
              </div>
            </>
          )}
        </div>
        
      </div>
    </header>
  </div>
);

  // 모바일 버전 헤더
  const MobileHeader = () => (
    <header className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-4 py-4 bg-white border-b border-grey-border">
       <img src={SOUFLogo} alt="SouF" className="w-16 cursor-pointer" onClick={() => handleNavigation("/")} />

      <div className="flex items-center gap-x-2">
  {memberId && (
    <button className="p-2" onClick={() => handleNavigation("/chat")}>
      <img src={ChatIcon} alt="chat" className="w-5 h-5" />
    </button>
  )}

  {/* 햄버거 버튼 */}
  <button
    onClick={toggleMobileMenu}
    className="w-8 h-8 flex flex-col justify-center items-center lg:hidden focus:outline-none"
  >
    <span
      className={`block w-6 h-0.5 bg-black rounded origin-center transition-transform duration-300 ease-in-out
        ${showMobileMenu ? "rotate-45 translate-y-1.5" : ""}`}
    />
    <span
      className={`block w-6 h-0.5 bg-black rounded my-1 transition-opacity duration-300 ease-in-out
        ${showMobileMenu ? "opacity-0" : ""}`}
    />
    <span
      className={`block w-6 h-0.5 bg-black rounded origin-center transition-transform duration-300 ease-in-out
        ${showMobileMenu ? "-rotate-45 -translate-y-1.5" : ""}`}
    />
  </button>
</div>

<div
  ref={mobileMenuRef}
  className={`
    absolute top-16 left-0 w-full bg-white border-b border-grey-border shadow-lg z-50
    transition-all duration-300 ease-in-out overflow-hidden
    ${showMobileMenu ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
  `}
>



  <div className="px-4 py-4">
    <h3 className="text-md font-bold text-gray-700 mb-3">카테고리</h3>
    <ul className="space-y-2">
      <li>
        <button className="block w-full px-3 py-2 text-left text-gray-700" onClick={() => handleNavigation("/recruitUpload")}>외주 의뢰하기</button>
        <button className="block w-full px-3 py-2 text-left text-gray-700" onClick={() => handleNavigation("/recruit")}>외주 찾기</button>
        <button className="block w-full px-3 py-2 text-left text-gray-700" onClick={() => handleNavigation("/feed")}>대학생 피드보기</button>
        {/* <button className="block w-full px-3 py-2 text-left text-gray-700" onClick={() => handleNavigation("/review")}>외주 후기</button> */}
        <button className="block w-full px-3 py-2 text-left text-gray-700" onClick={() => handleNavigation("/guide")}>이용가이드</button>
      </li>
    </ul>
    <h3 className="text-md font-bold text-gray-700 my-3">로그인 메뉴</h3>
    {/* 추가적인 메뉴 (로그인 상태에 따라) */}
    {memberId ? (
      <div className="mt-4 space-y-2">
        <div className="px-3 py-2 bg-blue-main rounded-lg">
          <UserTypeLabel />
        </div>
        <button
          className="block w-full px-3 py-2 text-left text-gray-700"
          onClick={() => handleNavigation("/mypage")}
        >
          마이페이지
        </button>
        <button
          className="block w-full px-3 py-2 text-left text-gray-700"
          onClick={() =>
            handleNavigation(roleType === "MEMBER" ? "/recruitUpload" : "/postUpload")
          }
        >
          {roleType === "MEMBER" ? "공고문 작성하기" : "피드 작성하기"}
        </button>
        <button
          className="block w-full px-3 py-2 text-left text-gray-700"
          onClick={toggleLogin}
        >
          로그아웃
        </button>
      </div>
    ) : (
      <div className="mt-4 space-y-2">
        <button
          className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg text-md"
          onClick={() => handleNavigation("/login")}
        >
          로그인
        </button>
        <button
          className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg text-md"
          onClick={() => handleNavigation("/join")}
        >
          회원가입
        </button>
      </div>
    )}
  </div>
</div>

      
    </header>
  );

  return (
    <>
      <div className="hidden lg:block">
        <DesktopHeader />
      </div>
      
      <div className="block lg:hidden">
        <MobileHeader />
      </div>

      {showAlertModal && (
        <AlertModal
          type="simple"
          title="로그인 후 이용해주세요."
          description="외주 등록은 일반 회원만 이용할 수 있습니다."
          TrueBtnText="로그인하러 가기"
          FalseBtnText="취소"
          onClickTrue={() => {
            setShowAlertModal(false);
            navigate("/login");
          }}
          onClickFalse={() => setShowAlertModal(false)}
        />
      )}

      {showFeedAlertModal && (
        <AlertModal
          type="simple"
          title="권한이 없습니다"
          description="피드 등록은 학생 계정만 이용할 수 있습니다."
          TrueBtnText="로그인하러 가기"
          FalseBtnText="취소"
          onClickTrue={() => {
            setShowFeedAlertModal(false);
            navigate("/login");
          }}
          onClickFalse={() => setShowFeedAlertModal(false)}
        />
      )}
    </>
  );
}
