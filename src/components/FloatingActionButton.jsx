import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserStore } from "../store/userStore";

export default function FloatingActionButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { memberId, roleType } = UserStore();

  // 제외할 페이지들
  const excludedPages = [
    "/login",
    "/join",
    "/postUpload",
    "/recruitUpload",
    "/mypage"
  ];

  // 현재 페이지가 제외 목록에 있는지 확인
  const shouldShow = memberId && !excludedPages.includes(location.pathname);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
      {/* ADMIN인 경우 두 버튼 모두 표시 */}
      {roleType === "ADMIN" && (
        <>
          <button
            onClick={() => navigate("/recruitUpload")}
            className="bg-yellow-point text-white px-2 py-2 lg:px-6 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 font-bold text-sm lg:text-lg"
          >
            <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            공고문 작성
          </button>
          <button
            onClick={() => navigate("/postUpload")}
            className="bg-blue-500 text-white px-2 py-2 lg:px-6 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 font-bold text-sm lg:text-lg"
          >
            <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            피드 작성
          </button>
        </>
      )}
      
      {/* MEMBER인 경우 공고문 작성 버튼만 표시 */}
      {roleType === "MEMBER" && (
        <button
          onClick={() => navigate("/recruitUpload")}
          className="bg-yellow-point text-white px-2 py-2 lg:px-6 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 font-bold text-sm lg:text-lg"
        >
          <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          공고문 작성
        </button>
      )}
      
      {/* STUDENT인 경우 피드 작성 버튼만 표시 */}
      {roleType === "STUDENT" && (
        <button
          onClick={() => navigate("/postUpload")}
          className="bg-yellow-point text-white px-2 py-2 lg:px-6 lg:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 font-bold text-sm lg:text-lg"
        >
          <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          피드 작성
        </button>
      )}
    </div>
  );
} 