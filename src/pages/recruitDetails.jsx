import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export default function RecruitDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const recruitData = location.state;

  useEffect(() => {
    console.log("RecruitDetail 컴포넌트가 로드됨");
    console.log("ID:", id);
    console.log("Location state:", location.state);
  }, [id, location]);

  // 날짜 형식 변환
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 마감일 계산 (D-n 또는 지원마감)
  const calculateDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - today;
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (dayDiff <= 0) {
      return "지원마감";
    } else {
      return `D-${dayDiff}`;
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!recruitData) {
    console.log("recruitData가 없음");
    return (
      <div className="p-8">
        <button 
          className="flex items-center text-gray-600 mb-8 hover:text-black"
          onClick={handleGoBack}
        >
         
        </button>
        <div className="text-center">데이터를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button 
        className="flex items-center text-gray-600 mb-8 hover:text-black"
        onClick={handleGoBack}
      >
       
      </button>

      <div className="bg-white rounded-3xl border border-gray p-8 mb-8">
        {/* 태그 영역 */}
        <div className="flex gap-2 mb-4">
          {recruitData.preferMajor && (
            <span className="text-base px-3 py-1 bg-gray-200 text-gray-700 rounded-lg">
              전공자우대
            </span>
          )}
          {recruitData.location && (
            <span className="text-base px-3 py-1 bg-gray-200 text-gray-700 rounded-lg">
              {recruitData.location}
            </span>
          )}
          {recruitData.deadline && (
            <span className="text-base px-3 py-1 bg-yellow-point text-white rounded-lg">
              {calculateDeadline(recruitData.deadline)}
            </span>
          )}
        </div>

        {/* 제목 및 카테고리 */}
        <h1 className="text-4xl font-bold mb-3">{recruitData.title}</h1>
        <div className="text-lg text-gray-600 mb-2">{recruitData.category}</div>

        {/* 가격 및 지원자 정보 */}
        <div className="flex justify-between mb-8 text-lg">
          <span className="font-medium">
            {recruitData.minPrice.toLocaleString()}원 ~ {recruitData.maxPrice.toLocaleString()}원
          </span>
          <span>
            지원자 {recruitData.applicants}명
          </span>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 mb-8"></div>

        {/* 상세 내용 */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">상세 내용</h2>
          <p className="text-gray-800 whitespace-pre-wrap">{recruitData.content}</p>
        </div>

        {/* 마감일 표시 */}
        <div className="mt-8 text-gray-600">
          <p>지원 마감일: {formatDate(recruitData.deadline)}</p>
        </div>
      </div>

      {/* 지원하기 버튼 */}
      <div className="flex justify-center">
        <button 
          className="bg-yellow-point text-white px-8 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity"
          onClick={() => alert('지원 기능은 아직 준비 중입니다.')}
        >
          지원하기
        </button>
      </div>
    </div>
  );
}