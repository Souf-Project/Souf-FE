import {React, useRef} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatIcon from "../assets/images/chatIco.svg";
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import { Link } from "react-router-dom";
import { UserStore } from "../store/userStore";
import SOUFLogo from "../assets/images/SouFLogo.png";

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

  const handleNavigationCategory = (categoryId) => {
    if (location.pathname !== "/recruit") {
      navigate(`/recruit?category=${categoryId}`);
    } else {
    
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set("category", categoryId);
      navigate(`/recruit?${newSearchParams.toString()}`);
    }
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
    <header className="fixed top-0 left-0 z-50 w-screen headerGlass">
      <div className="flex items-center justify-between px-10 py-4 max-w-[100rem] mx-auto">
      <div className="flex items-center gap-x-10">
      <img src={SOUFLogo} alt="SouF" className="w-28" onClick={() => handleNavigation("/")}/>
      
        <ul className="flex items-center gap-x-8 font-bold text-2xl text-black">
          <li>외주 의뢰하기</li>
          <li>외주 찾기</li>
          <li>대학생 피드보기</li>
          <li>외주 후기</li>
          <li>실험실</li>
          
          <li className="text-gray-400 font-medium">|</li>
          <li>이용 가이드</li>
          {/* <li
            className={`px-2 cursor-pointer transition-colors duration-200 relative group whitespace-nowrap ${
              activeCategory === "contests" ? "text-yellow-point" : ""
            }`}
            onClick={() => handleNavigation("/contests")}
          >
            <span>공모전&대외활동</span>
            <span
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
                activeCategory === "contests"
                  ? "w-full"
                  : "w-0 group-hover:w-full origin-left"
              }`}
            ></span>
          </li> */}
        </ul>
      </div>

      <div className="flex items-center gap-x-4">
      {/* <div
            className="text-black bg-[#FFFBE5] px-5 py-2 font-bold rounded-lg whitespace-nowrap cursor-pointer shadow-md"
            onClick={() => handleNavigation("/recruitsAll")}
          >
            <span>공고문 모아보기</span>
          </div> */}
        {memberId ? (
          // 로그인 상태
          <div className="flex items-center gap-x-4">
             
            {roleType === "MEMBER" && 
            <button
              className="text-white bg-blue-main px-5 py-2 font-bold rounded-lg whitespace-nowrap shadow-md"
              onClick={() => handleNavigation("/verifyStudent")}
            >
              대학생 인증
            </button>}
            <button className="p-2" onClick={() => handleNavigation("/chat")}>
              <img src={ChatIcon} alt="chat" className="w-6 h-6" />
            </button>
            <div className="relative user-menu-container">
              <button
                className="text-white bg-blue-main py-2 font-bold rounded-lg w-36 shadow-md"
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
            <div className="flex items-center text-2xl font-bold gap-x-4">
              <button
                className="w-20"
                onClick={() => handleNavigation("/login")}
              >
                로그인
              </button>
            
              <button
                className="text-white bg-blue-main px-6 py-4 font-bold rounded-3xl whitespace-nowrap shadow-md"
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
        <div className="px-3 py-2 bg-blue-main rounded-lg">
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
