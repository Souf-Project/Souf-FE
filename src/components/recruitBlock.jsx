import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../assets/categoryIndex/third_category.json';
import { getRecruitDetail } from '../api/recruit';
import AlertModal from './alertModal';

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
  recruitable,
  payment,
  minPayment,
  maxPayment,
  cityName,
  cityDetailName,
  secondCategory,
  categoryDtoList,
}) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const maxLength = 100;
  const navigate = useNavigate();
  
  const getSecondCategoryNames = (secondCategoryIds) => {
    if (!secondCategoryIds || !Array.isArray(secondCategoryIds)) return [];
    
    return secondCategoryIds.map(categoryId => {
      const category = secondCategoryData.second_category.find(
        (cat) => cat.second_category_id === categoryId
      );
      return category ? category.name : '';
    }).filter(name => name !== '');
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return '';
    const category = secondCategoryData.second_category.find(
      (cat) => cat.second_category_id === categoryId
    );
    return category ? category.name : '';
  };

  const getCategoryNames = (categoryDtoList) => {
    // console.log('getCategoryNames called with:', categoryDtoList);
    if (!categoryDtoList || categoryDtoList.length === 0) {
      // console.log('categoryDtoList is empty or null');
      return [];
    }

    const result = categoryDtoList.map(dto => {
      const firstCatId = dto.firstCategory;
      const secondCatId = dto.secondCategory;
      const thirdCatId = dto.thirdCategory;

      console.log('Processing category:', { firstCatId, secondCatId, thirdCatId });

      const firstName = firstCategoryData.first_category.find(
        cat => cat.first_category_id === firstCatId
      )?.name || '';

      const secondName = secondCategoryData.second_category.find(
        cat => cat.second_category_id === secondCatId
      )?.name || '';

      const thirdName = thirdCategoryData.third_category.find(
        cat => cat.third_category_id === thirdCatId
      )?.name || '';

      console.log('Found names:', { firstName, secondName, thirdName });

      return { first: firstName, second: secondName, third: thirdName };
    });

    console.log('Final result:', result);
    return result;
  };

  const calculateDday = (deadline, recruitable) => {
    // recruitable이 false이면 마감
    if (recruitable === false) return "마감";
    
    // deadline이 없으면 마감
    if (!deadline) return "마감";
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - today;
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // deadline이 지났으면 마감
    if (dayDiff <= 0) {
      return "마감";
    } else {
      return `D-${dayDiff}`;
    }
  };

  const getDdayStyle = (deadline, recruitable) => {
    const ddayText = calculateDday(deadline, recruitable);
    
    if (ddayText === "마감") {
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
      
      // 403 에러인 경우 로그인 모달 표시
      if (error.response?.status === 403) {
        setShowLoginModal(true);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex w-full bg-white rounded-2xl shadow-md mb-4 cursor-pointer border border-gray hover:shadow-md transition-shadow duration-200"
    >
      {/* <div className="flex items-center gap-2 mb-4">
        <div className={getDdayStyle(deadLine, recruitable)}>{calculateDday(deadLine, recruitable)}</div>
        <div className='font-regular text-base bg-[#DFDFDF] text-gray-500 rounded-lg px-4 py-1'>{cityName + " " + cityDetailName}</div>
       
      </div> */}
      <div className="bg-gray-300 w-48 h-48 rounded-2xl">
      </div>
      <div className="flex flex-col justify-between items-start px-6 py-2 flex-1">
        <div className="flex text-neutral-600 text-base">
          {(() => {
          
            if (categoryDtoList && categoryDtoList.length > 0) {
              const categories = getCategoryNames(categoryDtoList);
              return categories.map((category, index) => (
                <div key={index} className="mb-1">
                  <span>{category.first}</span>
                  <span className="mx-2">&gt;</span>
                  <span>{category.second}</span>
                  <span className="mx-2">&gt;</span>
                  <span>{category.third}</span>
                </div>
              ));
            } else if (secondCategory && Array.isArray(secondCategory)) {
              const categoryNames = getSecondCategoryNames(secondCategory);
              return categoryNames.map((categoryName, index) => (
                <div key={index} className="mb-1">
                  <span>{categoryName}</span>
                </div>
              ));
            }
            return null;
          })()}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-zinc-500 text-base line-clamp-2">
        {content || "내용 없음"}
      </p>
      <div className="text-base font-bold w-full border-t border-gray-300 pt-2">
        관영컴퍼니
      </div>
        
      </div>
      <div className="w-[1px] bg-gray-200 self-stretch"></div>
      <div className="flex flex-col items-start justify-center gap-2 w-1/5 px-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-regular text-black ">견적 비용</span>
          <span className="text-sm font-regular text-black ">{payment}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-regular text-black ">신청 인원</span>
          <span className="text-sm font-regular text-black ">00명</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-regular text-black ">우대 전공</span>
          <span className="text-sm font-regular text-black ">패션 디자인 / 조형 조소 / 회화과</span>
        </div>
         <div className="flex items-center gap-4">
           <span className="text-sm font-regular text-black ">납기일</span>
           <span className="text-sm font-regular text-black ">{deadLine ? deadLine.split(' ')[0] : ''}</span>
         </div>
       
      </div>
      
      {showLoginModal && (
        <AlertModal
        type="simple"
        title="로그인이 필요합니다"
        description="SouF 회원만 상세 글을 조회할 수 있습니다!"
        TrueBtnText="로그인하러 가기"
        FalseBtnText="취소"
        onClickTrue={() => {
          setShowLoginModal(false);
          navigate("/login");
        }}
        onClickFalse={() => setShowLoginModal(false)}
      />
      )}
    </div>
  );
}