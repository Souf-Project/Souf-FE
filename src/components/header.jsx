import {React, useRef} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatIcon from "../assets/images/chatIco.svg";
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import { Link } from "react-router-dom";
import { UserStore } from "../store/userStore";

export default function Header() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userType, setUserType] = useState("");
  const [userName, setUserName] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { nickname, roleType, memberId } = UserStore();
  //const username = UserStore((state) => state.username);
  //const roleType = UserStore((state) => state.roleType);
  //const memberId = UserStore((state) => state.memberId);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const mobileMenuRef = useRef(null);



  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const location = useLocation();
  const query = useQuery();
  const categoryFromQuery = query.get("category");

  useEffect(() => {
    // userStore의 memberId가 있으면 로그인 상태로 간주
    if (memberId) {
      setIsLogin(true);
      setUserType(roleType || "student");
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
      // recruitDetails 페이지에서는 카테고리 선택 없음
      setActiveCategory("");
    } else if (location.pathname === "/contests") {
      // 공모전 정보 페이지인 경우
      setActiveCategory("contests");
    } else {
      setActiveCategory("");
    }
  }, [location.pathname, categoryFromQuery]);

  // 유저 메뉴 외부 클릭 시 닫기
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

  // 메뉴 외부 클릭 감지
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

  const handleNavigationCategory = (categoryId) => {
    
    
    // 현재 경로가 /recruit가 아닌 경우에만 /recruit로 이동
    if (location.pathname !== "/recruit") {
     
      navigate(`/recruit?category=${categoryId}`);
    } else {
    
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set("category", categoryId);
      navigate(`/recruit?${newSearchParams.toString()}`);
    }
    setShowMobileMenu(false);
  };

  // 카테고리 이름을 가져오는 함수
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.first_category_id === categoryId);
    return category ? category.name : '';
  };

  // 로그인 상태 전환 함수 (임시)
  const toggleLogin = () => {
    // userStore 초기화
    UserStore.getState().clearUser();
    
    // 로컬 스토리지 초기화
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user-storage");
    
    // 로그인 상태 변경
    setIsLogin(false);
    setShowUserMenu(false);
    setShowMobileMenu(false);
    
    // 홈페이지로 이동
    navigate("/");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleMobileMenu = () => {
    setMenuAnimating(true);
    setShowMobileMenu((prev) => !prev);
  };

  const categories = firstCategoryData.first_category;


  const UserTypeLabel = () => {
    if (roleType === "ADMIN") {
      return (
        <div className="flex justify-center gap-2">
          <span className="font-bold">관리자</span>
          <span className="font-normal ml-1">{nickname}</span>
        </div>
      );
    } else if (roleType === "STUDENT") {
      return (
        <div className="flex justify-center gap-2">
          <span className="font-bold">학생</span>
          <span className="font-normal ml-1">{nickname}</span>
        </div>
      );
    } else {
      return (
        <div>
          <span className="font-bold">기업</span>
          <span className="font-normal ml-1">{nickname}</span>
        </div>
      );
    }
  };

  // PC 버전 헤더
  const DesktopHeader = () => (
    <header className="fixed top-0 left-0 z-50 w-screen flex items-center justify-between px-10 py-4 headerGlass">
      <div className="flex items-center gap-x-10">
        <div
          className="text-4xl font-bold text-black cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          SouF
        </div>
        <ul className="flex items-center gap-x-8 font-bold text-xl text-black">
          {categories.map((category) => {
            return (
              <li
                key={category.first_category_id}
                className={`px-2 cursor-pointer transition-colors duration-200 relative group ${
                  activeCategory === category.first_category_id.toString() ? "text-yellow-point" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                 
                  handleNavigationCategory(category.first_category_id);
                }}
              >
                <span>{category.name}</span>
                <span
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
                    activeCategory === category.first_category_id.toString()
                      ? "w-full"
                      : "w-0 group-hover:w-full origin-left"
                  }`}
                ></span>
              </li>
            );
          })}
          
          <li className="text-gray-400">|</li>
          <li
            className={`px-2 cursor-pointer transition-colors duration-200 relative group ${
              activeCategory === "contests" ? "text-yellow-point" : ""
            }`}
            onClick={() => handleNavigation("/contests")}
          >
            <span>공모전 정보</span>
            <span
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
                activeCategory === "contests"
                  ? "w-full"
                  : "w-0 group-hover:w-full origin-left"
              }`}
            ></span>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-x-4">
        {memberId ? (
          // 로그인 상태
          <div className="flex items-center gap-x-4">
            {roleType === "MEMBER" && 
            <button
              className="text-black bg-yellow-main px-5 py-2 font-bold rounded-lg"
              onClick={() => handleNavigation("/verifyStudent")}
            >
              대학생 인증
            </button>}
            <button className="p-2" onClick={() => handleNavigation("/chat")}>
              <img src={ChatIcon} alt="chat" className="w-6 h-6" />
            </button>
            <div className="relative user-menu-container">
              <button
                className="text-black bg-yellow-main py-2 font-bold rounded-lg w-36"
                onClick={toggleUserMenu}
              >
                <UserTypeLabel />
              </button>

              {showUserMenu && (
                <div className="fixed right-10 mt-2 w-36 bg-white rounded-lg shadow-lg py-1 z-[999999] border border-gray-200">
                  <button
                    className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-yellow-point"
                    onClick={() => handleNavigation("/mypage")}
                  >
                    마이페이지
                  </button>
                  
                  {/* ADMIN인 경우 두 버튼 모두 표시 */}
                  {roleType === "ADMIN" && (
                    <>
                      <button
                        className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-yellow-point"
                        onClick={() => handleNavigation("/recruitUpload")}
                      >
                        공고문 작성하기
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-yellow-point"
                        onClick={() => handleNavigation("/postUpload")}
                      >
                        피드 작성하기
                      </button>
                    </>
                  )}
                  
                  {/* MEMBER인 경우 공고문 작성 버튼만 표시 */}
                  {roleType === "MEMBER" && (
                    <button
                      className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-yellow-point"
                      onClick={() => handleNavigation("/recruitUpload")}
                    >
                      공고문 작성하기
                    </button>
                  )}
                  
                  {/* STUDENT인 경우 피드 작성 버튼만 표시 */}
                  {roleType === "STUDENT" && (
                    <button
                      className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-yellow-point"
                      onClick={() => handleNavigation("/postUpload")}
                    >
                      피드 작성하기
                    </button>
                  )}
                  
                  <button
                    className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-yellow-point"
                    onClick={toggleLogin}
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // 로그아웃 상태
          <>
            <button
              className="text-black bg-yellow-main px-5 py-2 font-bold rounded-lg"
              onClick={() => handleNavigation("/verifyStudent")}
            >
              대학생 인증
            </button>
            <div className="flex items-center text-xl font-semibold">
              <button
                className="w-20"
                onClick={() => handleNavigation("/login")}
              >
                로그인
              </button>
              <span className="mx-2 font-thin">|</span>
              <button
                className="w-20"
                onClick={() => handleNavigation("/join")}
              >
                회원가입
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );

  // 모바일 버전 헤더
  const MobileHeader = () => (
    <header className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-4 py-4 bg-white border-b border-grey-border">
      <div
        className="text-2xl font-bold text-black cursor-pointer"
        onClick={() => handleNavigation("/")}
      >
        SouF
      </div>

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
    absolute top-full left-0 w-full bg-white border-b border-grey-border shadow-lg z-50
    transition-all duration-300 ease-in-out overflow-hidden
    ${showMobileMenu ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
  `}
>



  <div className="px-4 py-4">
    <h3 className="text-lg font-bold text-gray-700 mb-3">카테고리</h3>
    <ul className="space-y-2">
      {categories.map((category) => (
        <li
          key={category.first_category_id}
          className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            activeCategory === category.first_category_id.toString()
              ? "bg-yellow-point text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleNavigationCategory(category.first_category_id)}
        >
          {category.name}
        </li>
      ))}
    </ul>
    <h3 className="text-lg font-bold text-gray-700 my-3">로그인 메뉴</h3>
    {/* 추가적인 메뉴 (로그인 상태에 따라) */}
    {memberId ? (
      <div className="mt-4 space-y-2">
        <div className="px-3 py-2 bg-yellow-main rounded-lg">
          <UserTypeLabel />
        </div>
        <button
          className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={() => handleNavigation("/mypage")}
        >
          마이페이지
        </button>
        <button
          className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={() =>
            handleNavigation(roleType === "MEMBER" ? "/recruitUpload" : "/postUpload")
          }
        >
          {roleType === "MEMBER" ? "공고문 작성하기" : "피드 작성하기"}
        </button>
        <button
          className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={toggleLogin}
        >
          로그아웃
        </button>
      </div>
    ) : (
      <div className="mt-4 space-y-2">
        <button
          className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={() => handleNavigation("/verifyStudent")}
        >
          대학생 인증
        </button>
        <button
          className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={() => handleNavigation("/login")}
        >
          로그인
        </button>
        <button
          className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
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
      {/* PC 버전 (md 이상) */}
      <div className="hidden lg:block">
        <DesktopHeader />
      </div>
      
      {/* 모바일 버전 (md 미만) */}
      <div className="block lg:hidden">
        <MobileHeader />
      </div>
    </>
  );
}
