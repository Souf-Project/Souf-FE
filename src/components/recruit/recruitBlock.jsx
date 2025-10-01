import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firstCategoryData from '../../assets/categoryIndex/first_category.json';
import secondCategoryData from '../../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../../assets/categoryIndex/third_category.json';
import { getRecruitDetail } from '../../api/recruit';
import AlertModal from '../alertModal';
import shareIco from '../../assets/images/shareIco.svg';
import soufMockup from '../../assets/images/soufMockup.png';


export default function RecruitBlock({
  id,
  title,
  content,
  deadLine,
  startDate,
  recruitable,
  nickname,
  price,
  cityName,
  cityDetailName,
  secondCategory,
  categoryDtoList,
  firstMediaUrl,
}) {
  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;
  const [showLoginModal, setShowLoginModal] = useState(false);
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

      // console.log('Found names:', { firstName, secondName, thirdName });

      return { first: firstName, second: secondName, third: thirdName };
    });

    // console.log('Final result:', result);
    return result;
  };


  const handleClick = async () => {
    try {
      const response = await getRecruitDetail(id);
      // console.log('Recruit detail response:', response);
      
      const recruitDetail = response.data.result;
      
      navigate(`/recruitDetails/${id}`, {
        state: {
          title,
          content,
          cityName,
          cityDetailName,
          price: price,
          deadline: deadLine,
          startDate: startDate,
          location: cityName,
          preferMajor: false, 
          id,
          recruitDetail,
          categoryDtoList,
        }
      });
    } catch (error) {
      console.error('Error fetching recruit detail:', error);
      
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex w-full bg-white rounded-2xl shadow-md mb-4 cursor-pointer border border-gray hover:shadow-md transition-shadow duration-200"
    >
      
        {firstMediaUrl ? (
          <img src={`${S3_BUCKET_URL}${firstMediaUrl}`} alt="공고문 이미지" className="w-40 h-40 rounded-2xl object-cover" />
        ) : (
          <img src={soufMockup} alt="기본 로고 이미지" className="w-40 h-40 rounded-2xl object-cover" />
        )}
      <div className="flex flex-col px-4 py-3 flex-1 gap-2 max-w-[26rem]">
        <div className="flex justify-between items-center">
        <div className="flex text-blue-600 text-sm">
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
        {/* <img src={shareIco} alt="shareIco" className="w-4 h-4 cursor-pointer" 
        onClick={console.log("share")} /> */}
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">{title}</h2>
        <p className="text-zinc-500 text-base line-clamp-2">
        {content || "내용 없음"}
      </p>
      <div className="text-base font-bold w-full border-t border-gray-300 pt-2 mt-auto">
        {nickname}
      </div>
        
      </div>
      <div className="w-[1px] bg-gray-200 self-stretch my-2"></div>
      <div className="flex flex-col items-start gap-4 w-44 px-2 mt-4">
        <div className="flex items-center gap-4 justify-between w-full">
          <span className="text-xs font-medium text-black ">견적 비용</span>
          <span className="text-md font-regular text-black ">{price}</span>
        </div>
        {/* <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-black ">우대사항</span>
          <ul className="text-xs font-regular text-black list-disc pl-4">
            <li>패션 디자인 전공</li>
            <li>조형 조소과</li>
            <li>회화과</li>
          </ul>
        </div> */}
         <div className="flex gap-4 justify-between w-full">
         <span className="text-xs font-medium text-black whitespace-nowrap">마감일</span>
          <div className="flex flex-col items-start">
          <span className="text-md font-regular text-black ">{startDate ? startDate.split(' ')[0] : ''}~ </span>
          <span className="text-md font-regular text-black ">{deadLine ? deadLine.split(' ')[0] : ''}</span>
          </div>
          
          
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
