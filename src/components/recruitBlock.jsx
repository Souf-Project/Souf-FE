import React from 'react';
import { useNavigate } from 'react-router-dom';
import secondCategoryData from '../assets/categoryIndex/second_category.json';

export default function RecruitBlock({
  id,
  title,
  content,
  deadLine,
  payment,
  recruitCount,
  region,
  secondCategory
}) {
  const navigate = useNavigate();

  const getCategoryName = (categoryId) => {
    const category = secondCategoryData.second_category.find(
      (cat) => cat.second_category_id === categoryId
    );
    return category ? category.name : '';
  };

  const calculateDday = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - today;
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (dayDiff <= 0) {
      return "마감";
    } else {
      return `D-${dayDiff}`;
    }
  };

  const getDdayStyle = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - today;
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (dayDiff <= 0) {
      return 'font-regular text-base bg-yellow-main text-gray-500 rounded-lg px-5 py-1';
    } else {
      return 'font-semibold text-base bg-yellow-point text-white rounded-lg px-5 py-1';
    }
  };

  const handleClick = () => {
    const categoryMain = "디자인"; // 임시로 고정값 설정
    const categoryMiddle = getCategoryName(secondCategory[0]);
    const categorySmall = "전체"; // 임시로 고정값 설정

    navigate(`/recruitDetails/${id}`, {
      state: {
        title,
        content,
        categoryMain,
        categoryMiddle,
        categorySmall,
        minPrice: parseInt(payment.replace(/[^0-9]/g, '')),
        maxPrice: parseInt(payment.replace(/[^0-9]/g, '')),
        deadline: deadLine,
        location: region,
        preferMajor: false, // 임시로 고정값 설정
        applicants: recruitCount,
        id
      }
    });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-[30px] px-10 shadow-sm p-6 mb-4 cursor-pointer border border-gray hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={getDdayStyle(deadLine)}>{calculateDday(deadLine)}</div>
        <div className='font-regular text-base bg-[#DFDFDF] text-gray-500 rounded-lg px-4 py-1'>{region}</div>
      </div>
      <div className="flex flex-col justify-between items-start mb-4">
        <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
        <div className='text-2xl font-medium text-gray-500 '>{getCategoryName(secondCategory[0])}</div>
      </div>
      <p className="text-lg font-regular text-gray-600 mb-4">{content}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-regular text-black">모집 인원 {recruitCount}명</span>
          <span className="text-yellow-main text-2xl font-bold">|</span>
          <span className="text-2xl font-regular text-black ">{payment}</span>
        </div>
       
      </div>
    </div>
  );
}
