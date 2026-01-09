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

  const isAllSelected = tempSelectedCategories.length === 0;
  
  return (
    <div className="flex justify-between items-center w-full mx-auto h-auto bg-white overflow-y-auto mb-4">
      <div className="flex flex-wrap gap-4 mx-2 md:mx-0gi md:gap-6 text-sm md:text-base font-semibold transition-all duration-300 ease-in-out">
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
export default FeedCategoryMenu;