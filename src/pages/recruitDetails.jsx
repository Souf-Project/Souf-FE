import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import backArrow from '../assets/images/backArrow.svg';
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../assets/categoryIndex/third_category.json';

const parsePayment = (paymentString) => {
  if (!paymentString || typeof paymentString !== 'string') return null;
  let numStr = paymentString.replace(/[^0-9.]/g, '');
  let num = parseFloat(numStr);
  if (paymentString.includes('만')) {
    num *= 10000;
  }
  return isNaN(num) ? null : num;
};

const getCategoryNames = (categoryDtoList) => {
    if (!categoryDtoList || categoryDtoList.length === 0) {
        return [];
    }

    return categoryDtoList.map(dto => {
        const firstCatId = dto.firstCategory;
        const secondCatId = dto.secondCategory;
        const thirdCatId = dto.thirdCategory;

        const firstName = firstCategoryData.first_category.find(
            cat => cat.first_category_id === firstCatId
        )?.name || '';

        const secondName = secondCategoryData.second_category.find(
            cat => cat.second_category_id === secondCatId
        )?.name || '';

        const thirdName = thirdCategoryData.third_category.find(
            cat => cat.third_category_id === thirdCatId
        )?.name || '';

        return { first: firstName, second: secondName, third: thirdName };
    });
};

export default function RecruitDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const recruitData = location.state;
  const [recruitDetail, setRecruitDetail] = useState(null);

  useEffect(() => {
    // API에서 받은 상세 정보가 있으면 사용
    if (recruitData?.recruitDetail) {
      setRecruitDetail(recruitData.recruitDetail);
      console.log('Using API recruit detail:', recruitData.recruitDetail);
    }
  }, [recruitData]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
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

  // API에서 받은 상세 정보가 있으면 그것을 우선 사용, 없으면 기본 데이터 사용
  const displayData = recruitDetail || recruitData;
  const categoryList = recruitDetail?.categoryDtoList || recruitData?.categoryDtoList;
  const categoryNames = getCategoryNames(categoryList);

  const minPrice = recruitDetail ? parsePayment(recruitDetail.minPayment) : displayData.minPrice;
  const maxPrice = recruitDetail ? parsePayment(recruitDetail.maxPayment) : displayData.maxPrice;

  return (
    <div className="pt-16 px-8 w-5/6 mx-auto">
      <button 
        className="flex items-center text-gray-600 mb-4 hover:text-black transition-colors"
        onClick={handleGoBack}
      >
        <img src={backArrow} alt="뒤로가기" className="w-6 h-6 mr-2" />
        <span>목록으로 돌아가기</span>
      </button>

      <div className="bg-white rounded-2xl border border-gray p-8 mb-8 mt-4">
        <h1 className="text-3xl font-semibold">{displayData.title}</h1>
        <div className="border-t border-gray-200 my-6"></div>
        
        <div className="flex flex-col text-gray-600 mb-6 mt-2">
          {categoryNames.map((category, index) => (
            <div key={index} className="mb-1">
              <span>{category.first}</span>
              <span className="mx-2">&gt;</span>
              <span>{category.second}</span>
              <span className="mx-2">&gt;</span>
              <span className="font-medium text-black">{category.third}</span>
            </div>
          ))}
        </div>
        {/* <div className="border-t border-gray-200 my-6"></div> */}
        <div className="grid grid-cols-2 gap-8 my-6">
          <div className="space-y-4">
            <div>
              <span className="text-black mb-1">급여</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="font-medium">
                {minPrice && maxPrice
                  ? `${minPrice.toLocaleString()}원 ~ ${maxPrice.toLocaleString()}원`
                  : '금액 협의'}
              </span>
            </div>
            <div>
              <span className="text-black mb-1">기한</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="font-medium">{formatDate(displayData.deadline)}</span>
            </div>
            <div>
              <span className="text-black mb-1">지역</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="font-medium">{recruitDetail ? `${recruitDetail.cityName} ${recruitDetail.cityDetailName || ''}`.trim() : displayData.location}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <span className="text-black mb-1">우대사항</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="font-medium" style={{ whiteSpace: 'pre-wrap' }}>
                {recruitDetail?.preferentialTreatment
                  ? recruitDetail.preferentialTreatment
                  : (displayData.preferMajor ? '전공자 우대' : '경력/경험 무관')}
              </span>
            </div>
            
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>
        <div>
          <p className="text-2xl font-regular text-gray-800 mb-4"  style={{ whiteSpace: 'pre-wrap' }}>{displayData.content}</p>
          
          {recruitDetail?.mediaResDtos && recruitDetail.mediaResDtos.length > 0 ? (
          <img
            src={`https://iamsouf-bucket.s3.ap-northeast-2.amazonaws.com/${recruitDetail.mediaResDtos[0].fileUrl}`}
            alt={recruitDetail.mediaResDtos[0].fileName || "이미지"}
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400">이미지가 없습니다</p>
          </div>
        )}
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