import React from 'react';
import { useNavigate } from 'react-router-dom';
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import { getRecruitDetail } from '../api/recruit';

const parsePayment = (paymentString) => {
  if (!paymentString || typeof paymentString !== 'string') return 0;
  let numStr = paymentString.replace(/[^0-9.]/g, '');
  let num = parseFloat(numStr);
  if (paymentString.includes('만')) {
    num *= 10000;
  }
  return isNaN(num) ? 0 : num;
};

export default function RecruitBlock({
  id,
  title,
  content,
  deadLine,
  payment,
  minPayment,
  maxPayment,
  cityName,
  cityDetailName,
  secondCategory,
  categoryDtoList,
}) {
  const navigate = useNavigate();

  const getCategoryName = (categoryId) => {
    if (!categoryId) return '';
    const category = secondCategoryData.second_category.find(
      (cat) => cat.second_category_id === categoryId
    );
    return category ? category.name : '';
  };

  const calculateDday = (deadline) => {
    if (!deadline) return "마감";
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
    if (!deadline) return 'font-regular text-base bg-yellow-main text-gray-500 rounded-lg px-5 py-1';
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

  const handleClick = async () => {
    const minPrice = parsePayment(minPayment);
    const maxPrice = parsePayment(maxPayment);
    
    try {
      const response = await getRecruitDetail(id);
      console.log('Recruit detail response:', response);
      
      const recruitDetail = response.data.result;
      
      navigate(`/recruitDetails/${id}`, {
        state: {
          title,
          content,
          cityName,
          cityDetailName,
          minPrice,
          maxPrice,
          deadline: deadLine,
          location: cityName,
          preferMajor: false, 
          id,
          recruitDetail,
          categoryDtoList,
        }
      });
    } catch (error) {
      console.error('Error fetching recruit detail:', error);

      navigate(`/recruitDetails/${id}`, {
        state: {
          title,
          content,
          cityName,
          cityDetailName,
          minPrice,
          maxPrice,
          deadline: deadLine,
          location: cityName,
          preferMajor: false,
          id,
          categoryDtoList,
        }
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full bg-white rounded-[30px] px-10 shadow-sm p-6 mb-4 cursor-pointer border border-gray hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={getDdayStyle(deadLine)}>{calculateDday(deadLine)}</div>
        <div className='font-regular text-base bg-[#DFDFDF] text-gray-500 rounded-lg px-4 py-1'>{cityName}</div>
      </div>
      <div className="flex flex-col justify-between items-start mb-4">
        <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
        <div className='text-2xl font-medium text-gray-500 '>{getCategoryName(secondCategory[0])}</div>
      </div>
      <p className="text-lg font-regular text-gray-600 mb-4">{content}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-regular text-black ">{payment || '금액 협의'}</span>
        </div>
       
      </div>
    </div>
  );
}