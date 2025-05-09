import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect} from 'react';
import ChatIcon from '../assets/images/chatIco.svg';


export default function Header() {
   const navigate = useNavigate();
   const [activeCategory, setActiveCategory] = useState("");
   const [isLogin, setIsLogin] = useState(true);
   const [showUserMenu, setShowUserMenu] = useState(false); 
   const [userType, setUserType] = useState(""); 
   const [userName, setUserName] = useState("김시은");

   function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const location = useLocation();
  const query = useQuery();
  const categoryFromQuery = query.get("category");

useEffect(() => {
  const loginStatus = localStorage.getItem('isLogin');
  if (loginStatus === 'true') {
    setIsLogin(true);
    
    const type = localStorage.getItem('userType') || 'student';
    const name = localStorage.getItem('userName') || '김시은';
    setUserType(type);
    setUserName(name);
  }
}, []);

useEffect(() => {
  // /recruit 경로 & 카테고리 쿼리 파라미터가 있는 경우만
  if (location.pathname === "/recruit" && categoryFromQuery) {
    setActiveCategory(decodeURIComponent(categoryFromQuery));
  } else if (location.pathname === "/recruit" && !categoryFromQuery) {
    // /recruit 경로지만 카테고리가 없는 경우는 카테고리 선택 없음
    setActiveCategory("");
  } else if (location.pathname.includes("/recruitDetails/")) {
  } else {
    setActiveCategory("");
  }
}, [location.pathname, categoryFromQuery]);

// 유저 메뉴 외부 클릭 시 닫기
useEffect(() => {
  function handleClickOutside(event) {
    if (showUserMenu && !event.target.closest('.user-menu-container')) {
      setShowUserMenu(false);
    }
  }
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showUserMenu]);

   const handleNavigation = (path) => {
    navigate(path);
    setShowUserMenu(false); 
  };

  const handleNavigationCategory = (category) => {
    const encoded = encodeURIComponent(category);
    navigate(`/recruit?category=${encoded}`);
  };
  
  // 로그인 상태 전환 함수 (임시)
  const toggleLogin = () => {
    setIsLogin(!isLogin);
    localStorage.setItem('isLogin', !isLogin);
    setShowUserMenu(false); 
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const categories = [
    "순수미술 & 일러스트",
    "공예 & 제작",
    "음악 & 음향",
    "사진 & 영상 & 영화",
    "디지털 콘텐츠 & 그래픽 디자인"
  ];
  
  const UserTypeLabel = () => {
    if (userType === 'student') {
      return (
        <>
          <span className="font-bold">학생</span>
          <span className="font-normal ml-1">{userName}</span>
        </>
      );
    } else {
      return (
        <>
          <span className="font-bold">기업</span>
          <span className="font-normal ml-1">{userName}</span>
        </>
      );
    }
  };
  
  return (
    <header className="fixed top-0 left-0 z-50 w-screen flex items-center justify-between px-10 py-4 bg-white border-b border-grey-border">
      <div className="flex items-center gap-x-10">
        <div className="text-4xl font-bold text-black cursor-pointer" onClick={() => handleNavigation("/")}>SouF</div>
        <ul className="flex items-center gap-x-8 font-bold text-xl text-black">
          {categories.map((category) => (
            <li
            key={category}
            className={`px-2 cursor-pointer  transition-colors duration-200 relative group ${
              activeCategory === category ? "text-yellow-point" : ""
            }`}
            onClick={() => handleNavigationCategory(category)}
          >
            <span>{category}</span>
            <span 
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
                activeCategory === category 
                  ? 'w-full' 
                  : 'w-0 group-hover:w-full origin-left'
              }`}
            ></span>
          </li>
          
          ))}
        </ul>

      </div>

      <div className="flex items-center gap-x-4">
        {isLogin ? (
          // 로그인 상태
          <div className="flex items-center gap-x-4">
            <button className="p-2" onClick={() => handleNavigation("/chat")}>
              <img src={ChatIcon} alt="chat" className="w-6 h-6" />
            </button>
            <div className="relative user-menu-container">
              <button 
                className="text-black bg-yellow-main px-5 py-2 font-bold rounded-lg" 
                onClick={toggleUserMenu}
              >
                <UserTypeLabel />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <button 
                    className="block w-full px-4 py-2 text-md font-semibold text-gray-700 hover:text-yellow-point"
                    onClick={() => handleNavigation("/mypage")}
                  >
                    마이페이지
                  </button>
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
            <button className="text-black bg-yellow-main px-5 py-2 font-bold rounded-lg" onClick={() => handleNavigation("/verifyStudent")}>대학생 인증</button>
            <div className="flex items-center text-xl font-semibold">
              <button className="bg-white w-20" onClick={() => handleNavigation("/login")}>로그인</button>
              <span className="mx-2 font-thin">|</span>
              <button className="bg-white w-20" onClick={() => handleNavigation("/register")}>회원가입</button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
