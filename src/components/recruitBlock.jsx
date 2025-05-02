import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecruitBlock({ 
  id,
  title, 
  category, 
  content, 
  applicants, 
  minPrice, 
  maxPrice, 
  preferMajor, 
  location, 
  deadline 
}) {
  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate(`/recruitDetails/${id}`, { 
      state: { 
        id,
        title, 
        category, 
        content, 
        applicants, 
        minPrice, 
        maxPrice, 
        preferMajor, 
        location, 
        deadline 
      } 
    });
  };

  return (
    <div 
      className="bg-white rounded-3xl border border-gray p-6 w-3/4 mx-auto mb-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="flex gap-2 mb-3">
        {preferMajor && (
          <span className="text-base px-3 py-1 bg-gray-200 text-gray-700 rounded-lg">
            전공자우대
          </span>
        )}
        {location && (
          <span className="text-base px-3 py-1 bg-gray-200 text-gray-700 rounded-lg">
            {location}
          </span>
        )}
        {deadline && (
          <span className="text-base px-3 py-1 bg-yellow-point text-white rounded-lg">
            {calculateDeadline(deadline)}
          </span>
        )}
      </div>
      <h2 className="text-3xl font-semibold mb-2">{title}</h2>
      <div className="text-sm text-gray-600 mb-4">{category}</div>
      <p className="text-gray-800 mb-6 line-clamp-3">{content}</p>
      <div className="text-sm text-gray-600 border-t pt-4 flex justify-between">
        <span>지원자 {applicants}명</span>
        <span>{minPrice.toLocaleString()}원 ~ {maxPrice.toLocaleString()}원</span>
      </div>
    </div>
  );
}
