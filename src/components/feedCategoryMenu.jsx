import React, { useState, useEffect } from "react";
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import checkBoxIcon from '../assets/images/checkBoxIcon.svg';
import notCheckBoxIcon from '../assets/images/notCheckBoxIcon.svg';

const FeedCategoryMenu = ({ secondCategories, thirdCategories, onSelect, selectedCategories, onApply, onReset }) => {
  const [selectedFirstCategory, setSelectedFirstCategory] = useState(selectedCategories?.firstCategoryId || null);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);

  const firstCategories = firstCategoryData.first_category;

  const handleFirstCategoryClick = (firstCategory) => {
    const newCategories = [{
      firstCategory: firstCategory.first_category_id,
      secondCategory: null,
      thirdCategory: null
    }];
    setTempSelectedCategories(newCategories);
    // 바로 필터 적용
    if (onApply) {
      onApply(newCategories);
    }
  };


  const handleReset = () => {
    setSelectedFirstCategory(null);
    setTempSelectedCategories([]);
    
    // 부모 컴포넌트에 초기화 알림 및 바로 필터 적용
    if (onReset) {
      onReset();
    }
    // 빈 배열로 필터 적용 (전체 조회)
    if (onApply) {
      onApply([]);
    }
  };

  useEffect(() => {
    if (selectedCategories?.firstCategoryId) {
      setSelectedFirstCategory(selectedCategories.firstCategoryId);
    }
  }, [selectedCategories?.firstCategoryId]);

  // PC 버전 카테고리 메뉴
const DesktopCategoryMenu = () => {
  const isAllSelected = tempSelectedCategories.length === 0;
  
  return (
    <div className="hidden lg:flex justify-between items-center w-full mx-auto h-auto bg-white overflow-y-auto mb-4">
      <div className="flex flex-wrap gap-6 text-base font-semibold transition-all duration-300 ease-in-out">
        <div 
          className={`relative rounded cursor-pointer transition-colors flex items-center pb-2 group  ${
            isAllSelected
              ? ' text-blue-main font-bold'
              : 'text-gray-700 hover:text-blue-main'
          }`}
          onClick={handleReset}
        >
          전체
          <span 
            className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-main transition-transform duration-300 ease-in-out ${
              isAllSelected 
                ? 'scale-x-100' 
                : 'scale-x-0 group-hover:scale-x-100'
            }`}
          />
        </div>
        {firstCategories.map((first) => {
          const hasSelectedCategories = tempSelectedCategories.some(cat => cat.firstCategory === first.first_category_id);
          
          return (
            <div key={first.first_category_id}>
              <div 
                className={`relative rounded cursor-pointer transition-colors flex items-center pb-2 group ${
                  hasSelectedCategories
                    ? ' text-blue-main font-bold'
                    : 'text-gray-700 hover:text-blue-main'
                }`}
                onClick={() => handleFirstCategoryClick(first)}
              >
                {first.name}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-main transition-transform duration-300 ease-in-out ${
                    hasSelectedCategories 
                      ? 'scale-x-100' 
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
};


  // 모바일 버전 카테고리 메뉴
  const MobileCategoryMenu = () => {
    const isAllSelected = tempSelectedCategories.length === 0;
    
    return (
      <div className="block lg:hidden w-full bg-white border border-gray-200 rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-800 mb-3">카테고리</h3>
          
          {/* 전체 버튼 */}
          <div 
            className={`p-2 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 mb-2 ${
              isAllSelected
                ? ' text-blue-main font-semibold'
                : 'text-gray-700 hover:text-blue-main'
            }`}
            onClick={handleReset}
          >
            <img 
              src={isAllSelected ? checkBoxIcon : notCheckBoxIcon} 
              alt="checkbox" 
              className={`w-4 h-4`}
            />
            전체
          </div>
        </div>

        {/* 대분류 섹션 */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">대분류</h4>
          <div className="space-y-1">
            {/* 전체 버튼도 모바일에서 밑줄 추가 */}
            <div 
              className={`relative p-2 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 group ${
                isAllSelected
                  ? ' text-blue-main font-semibold'
                  : 'text-gray-700 hover:text-blue-main'
              }`}
              onClick={handleReset}
            >
              <img 
                src={isAllSelected ? checkBoxIcon : notCheckBoxIcon} 
                alt="checkbox" 
                className={`w-4 h-4`}
              />
              전체
              <span 
                className={`absolute bottom-0 left-2 right-2 h-0.5 bg-blue-main transition-transform duration-300 ease-in-out ${
                  isAllSelected 
                    ? 'scale-x-100' 
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </div>
            {firstCategories.map((first) => {
              const hasSelectedCategories = tempSelectedCategories.some(cat => cat.firstCategory === first.first_category_id);
              
              return (
                <div key={first.first_category_id}>
                  <div 
                    className={`relative p-2 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 group ${
                      hasSelectedCategories
                        ? ' text-blue-main font-semibold'
                        : 'text-gray-700 hover:text-blue-main'
                    }`}
                    onClick={() => handleFirstCategoryClick(first)}
                  >
                    <img 
                      src={hasSelectedCategories ? checkBoxIcon : notCheckBoxIcon} 
                      alt="checkbox" 
                      className={`w-4 h-4`}
                    />
                    {first.name}
                    <span 
                      className={`absolute bottom-0 left-2 right-2 h-0.5 bg-blue-main transition-transform duration-300 ease-in-out ${
                        hasSelectedCategories 
                          ? 'scale-x-100' 
                          : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DesktopCategoryMenu />
      <MobileCategoryMenu />
    </>
  );
};

export default FeedCategoryMenu;