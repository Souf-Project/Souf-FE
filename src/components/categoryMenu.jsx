import React, { useState, useEffect } from "react";
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import checkBoxIcon from '../assets/images/checkBoxIcon.svg';
import radioIcon from '../assets/images/radioIcon.svg';

const CategoryMenu = ({ secondCategories, thirdCategories, onSelect, selectedCategories }) => {
  const [selectedFirstCategory, setSelectedFirstCategory] = useState(selectedCategories?.firstCategoryId || 1);
  const [selectedSecondCategories, setSelectedSecondCategories] = useState(selectedCategories?.secondCategoryId ? [selectedCategories.secondCategoryId] : []);
  const [openSecondCategory, setOpenSecondCategory] = useState(null);

  const firstCategories = firstCategoryData.first_category;

  const handleFirstCategoryClick = (firstCategory) => {
    setSelectedFirstCategory(firstCategory.first_category_id);
    setSelectedSecondCategories([]); // 대분류 변경 시 중분류 선택 초기화
    if (onSelect) {
      onSelect(firstCategory.first_category_id, 0, 0);
    }
  };

  const handleSecondCategoryClick = (secondCategory) => {
    const isSelected = selectedSecondCategories.includes(secondCategory.second_category_id);
    
    if (isSelected) {
      // 이미 선택된 경우 제거
      const newSelected = selectedSecondCategories.filter(id => id !== secondCategory.second_category_id);
      setSelectedSecondCategories(newSelected);
    } else {
      // 선택되지 않은 경우 추가
      const newSelected = [...selectedSecondCategories, secondCategory.second_category_id];
      setSelectedSecondCategories(newSelected);
    }
    
    if (onSelect) {
      onSelect(secondCategory.first_category_id, secondCategory.second_category_id, 0);
    }
  };

  const handleThirdCategoryClick = (secondCategory, thirdCategory) => {
    if (onSelect) {
      onSelect(secondCategory.first_category_id, secondCategory.second_category_id, thirdCategory.third_category_id);
    }
  };

  // selectedCategories가 변경될 때 selectedFirstCategory 동기화
  useEffect(() => {
    if (selectedCategories?.firstCategoryId) {
      setSelectedFirstCategory(selectedCategories.firstCategoryId);
    }
    if (selectedCategories?.secondCategoryId) {
      setSelectedSecondCategories([selectedCategories.secondCategoryId]);
    }
  }, [selectedCategories?.firstCategoryId, selectedCategories?.secondCategoryId]);

  // 선택된 대분류에 해당하는 중분류만 필터링
  const filteredSecondCategories = secondCategories.filter(
    (second) => second.first_category_id === selectedFirstCategory
  );

  if (!secondCategories || secondCategories.length === 0) {
    return (
      <div className="w-60 h-[50%] border p-4 bg-gray-50 lg:hidden">
        <p className="text-gray-500 text-sm">카테고리를 불러오는 중...</p>
      </div>
    );
  }

  // PC 버전 카테고리 메뉴 (박스 형태)
const DesktopCategoryMenu = () => (
  <div className="hidden lg:block w-54 h-auto border border-gray-200 rounded-lg p-4 bg-white shadow-sm overflow-y-auto mb-20">
    <h3 className="text-base font-bold text-gray-800 mb-4">카테고리</h3>
    
    {/* 대분류 섹션 */}
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-600 mb-2">대분류</h4>
      <div className="space-y-1">
        {firstCategories.map((first) => {
          const isSelectedFirst = selectedFirstCategory === first.first_category_id;
          
          return (
            <div 
              key={first.first_category_id}
              className={`p-2 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 ${
                isSelectedFirst
                  ? ' text-blue-main font-semibold'
                  : 'text-gray-700 hover:text-blue-main'
              }`}
              onClick={() => handleFirstCategoryClick(first)}
            >
              <img 
                src={radioIcon} 
                alt="radio" 
                className={`w-4 h-4 ${isSelectedFirst ? '' : 'brightness-0 opacity-50'}`}
              />
              {first.name}
            </div>
          );
        })}
      </div>
    </div>

    {/* 중분류 섹션 */}
    <div>
      <h4 className="text-sm font-semibold text-gray-600 mb-2">중분류</h4>
      <div className="space-y-1">
        {filteredSecondCategories.map((second) => {
          const isSelectedSecond = selectedSecondCategories.includes(second.second_category_id);
          
          return (
            <div key={second.second_category_id}>
              <div 
                className={`p-2 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 ${
                  isSelectedSecond
                    ? ' text-blue-main font-semibold'
                    : 'text-gray-700 hover:text-blue-main hover:'
                }`}
                onClick={() => handleSecondCategoryClick(second)}
              >
                <img 
                  src={checkBoxIcon} 
                  alt="checkbox" 
                  className={`w-4 h-4 ${isSelectedSecond ? '' : 'brightness-0 opacity-50'}`}
                />
                {second.name}
              </div>
              
              {/* 소분류 (IT·개발이 아닌 경우에만) */}
              {second.first_category_id !== 6 && (
                <div className="mb-1">
                  {thirdCategories.third_category
                    .filter(third => third.second_category_id === second.second_category_id)
                    .map((third) => {
                      const isSelectedThird = selectedCategories?.thirdCategoryId === third.third_category_id;
                      
                      return (
                        <div 
                          key={third.third_category_id} 
                          className={`py-1 px-2 text-xs rounded cursor-pointer transition-colors ${
                            isSelectedThird
                              ? ' text-blue-main'
                              : 'text-gray-600 hover:text-blue-main hover:'
                          }`}
                          onClick={() => handleThirdCategoryClick(second, third)}
                        >
                          {third.name}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);


  // 모바일 버전 카테고리 메뉴 (좌우 반반)
  const MobileCategoryMenu = () => {
    const [selectedSecondCategory, setSelectedSecondCategory] = useState(null);

    const handleMobileSecondCategoryClick = (second) => {
      setSelectedSecondCategory(second);
      handleSecondCategoryClick(second);
    };

    const getThirdCategories = () => {
      if (!selectedSecondCategory) return [];
      return thirdCategories.third_category.filter(
        (third) => third.second_category_id === selectedSecondCategory.second_category_id
      );
    };

    return (
      <div className="block lg:hidden w-full bg-white border border-gray-200 rounded-lg">
        <div className="flex h-64">
          {/* 왼쪽: 대분류 */}
          <div className="w-1/2 border-r border-gray-200 bg-gray-50">
            <div className="overflow-y-auto h-full">
              {firstCategories.map((first) => {
                const isSelectedFirst = selectedFirstCategory === first.first_category_id;
                
                return (
                  <div
                    key={first.first_category_id}
                    className={`p-3 cursor-pointer transition-colors flex items-center gap-2 ${
                      isSelectedFirst
                        ? "bg-blue-main text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => handleFirstCategoryClick(first)}
                  >
                    <img 
                      src={radioIcon} 
                      alt="radio" 
                      className={`w-4 h-4 ${isSelectedFirst ? '' : 'brightness-0 opacity-50'}`}
                    />
                    <span className="text-sm font-medium">{first.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 오른쪽: 중분류 */}
          <div className="w-1/2">
            <div className="overflow-y-auto h-full">
              {filteredSecondCategories.map((second) => {
                const isSelectedSecond = selectedSecondCategories.includes(second.second_category_id);
                
                return (
                  <div
                    key={second.second_category_id}
                    className={`p-3 cursor-pointer transition-colors flex items-center gap-2 ${
                      selectedSecondCategory?.second_category_id === second.second_category_id || 
                      isSelectedSecond
                        ? "bg-blue-main text-white"
                        : "hover: hover:text-blue-main text-gray-700"
                    }`}
                    onClick={() => handleMobileSecondCategoryClick(second)}
                  >
                    <img 
                      src={checkBoxIcon} 
                      alt="checkbox" 
                      className={`w-4 h-4 ${isSelectedSecond ? '' : 'brightness-0 opacity-50'}`}
                    />
                    <span className="text-sm">{second.name}</span>
                  </div>
                );
              })}
            </div>
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

export default CategoryMenu;
