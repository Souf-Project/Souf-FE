import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect} from 'react';


export default function Header() {
   const navigate = useNavigate();
   const [activeCategory, setActiveCategory] = useState("");

   function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const location = useLocation();
const query = useQuery();
const categoryFromQuery = query.get("category");

useEffect(() => {
  if (location.pathname === "/recruit" && categoryFromQuery) {
    setActiveCategory(categoryFromQuery);
  } else {
    setActiveCategory("");
  }
}, [location]);

   const handleNavigation = (path) => {
    navigate(path);
  };

  const handleNavigationCategory = (category) => {
    const encoded = encodeURIComponent(category);
    navigate(`/recruit?category=${encoded}`);
    };

  const categories = [
    "순수미술 & 일러스트",
    "공예 & 제작",
    "음악 & 음향",
    "사진 & 영상 & 영화",
    "디지털 콘텐츠 & 그래픽 디자인"
  ];
  
  return (
    <header className="w-screen flex items-center justify-between px-10 py-4 bg-white shadow-sm">
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
              className={`absolute bottom-0 left-0 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
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
        <button className="text-black bg-yellow-main px-5 py-2 font-bold rounded-lg" onClick={() => handleNavigation("/verifyStudent")}>대학생 인증</button>
        <div className="flex items-center text-xl font-semibold">
          <button className="bg-white w-20" onClick={() => handleNavigation("/login")}>로그인</button>
          <span className="mx-2 font-thin">|</span>
          <button className="bg-white w-20" onClick={() => handleNavigation("/register")}>회원가입</button>
        </div>
      </div>
    </header>
  );
}
