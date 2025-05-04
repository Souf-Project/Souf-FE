import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import backArrow from '../assets/images/backArrow.svg';

export default function RecruitDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const recruitData = location.state;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="pt-24 px-8 max-w-4xl mx-auto">
      <button 
        className="flex items-center text-gray-600 mb-4 hover:text-black transition-colors"
        onClick={handleGoBack}
      >
        <img src={backArrow} alt="뒤로가기" className="w-6 h-6 mr-2" />
        <span>돌아가기</span>
      </button>

      <div className="bg-white rounded-2xl border border-gray p-8 mb-8 mt-4">
        <h1 className="text-3xl font-semibold">{recruitData.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6 mt-2">
          <span>{recruitData.categoryMain}</span>
          <span className="mx-2">&gt;</span>
          <span>{recruitData.categoryMiddle}</span>
          <span className="mx-2">&gt;</span>
          <span className="font-medium text-black">{recruitData.categorySmall}</span>
        </div>

        <div className="grid grid-cols-2 gap-8 my-6">
          <div className="space-y-4">
            <div>
              <span className="text-black mb-1">급여</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="font-medium">{recruitData.minPrice.toLocaleString()}원 ~ {recruitData.maxPrice.toLocaleString()}원</span>
            </div>
            <div>
              <span className="text-black mb-1">기한</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="font-medium">{formatDate(recruitData.deadline)}</span>
            </div>
            <div>
              <span className="text-black mb-1">지역</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="font-medium">{recruitData.location}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* <div>
              <span className="text-black mb-1">카테고리</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="font-medium">{recruitData.categorySmall}</span>
            </div> */}
            <div>
              <span className="text-black mb-1">우대사항</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="font-medium">{recruitData.preferMajor ? '전공자 우대' : '경력/경험 무관'}</span>
            </div>
            <div>
              <span className="text-black mb-1">지원자수</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="font-medium">{recruitData.applicants}명</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>
        <div>
          <p className="text-gray-800 whitespace-pre-wrap">{recruitData.content}</p>
        </div>

      <div className="flex justify-center mt-8">
        <button 
          className="bg-yellow-main text-black w-1/2 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity"
          onClick={() => alert('지원 기능')}
        >
          지원하기
        </button>
      </div>
      </div>

      
    </div>
  );
}