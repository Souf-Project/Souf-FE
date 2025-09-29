import React, { useState, useEffect } from "react";
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import checkBoxIcon from '../assets/images/checkBoxIcon.svg';
import notCheckBoxIcon from '../assets/images/notCheckBoxIcon.svg';

const CategoryMenu = ({ secondCategories, thirdCategories, onSelect, selectedCategories, onApply }) => {
  const [selectedFirstCategory, setSelectedFirstCategory] = useState(selectedCategories?.firstCategoryId || null);
  const [selectedSecondCategories, setSelectedSecondCategories] = useState(selectedCategories?.secondCategoryId ? [selectedCategories.secondCategoryId] : []);
  const [selectedThirdCategories, setSelectedThirdCategories] = useState(selectedCategories?.thirdCategoryId ? [selectedCategories.thirdCategoryId] : []);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [expandedFirstCategory, setExpandedFirstCategory] = useState(null);

  const firstCategories = firstCategoryData.first_category;

  const handleFirstCategoryClick = (firstCategory) => {
    const isExpanded = expandedFirstCategory === firstCategory.first_category_id;
    const isSelected = tempSelectedCategories.some(cat => 
      cat.firstCategory === firstCategory.first_category_id && 
      cat.secondCategory === null && 
      cat.thirdCategory === null
    );
    
    if (isExpanded) {
      // 이미 펼쳐진 상태면 접기
      setExpandedFirstCategory(null);
    } else {
      // 펼치기
      setExpandedFirstCategory(firstCategory.first_category_id);
    }
    
    // 선택/해제 토글
    if (isSelected) {
      // 제거
      const newTempSelected = tempSelectedCategories.filter(cat => 
        !(cat.firstCategory === firstCategory.first_category_id && 
          cat.secondCategory === null && 
          cat.thirdCategory === null)
      );
      setTempSelectedCategories(newTempSelected);
    } else {
      // 최대 3개까지만 선택 가능
      if (tempSelectedCategories.length >= 3) {
        alert('최대 3개의 카테고리만 선택할 수 있습니다.');
        return;
      }
      
      // 대분류만 선택된 카테고리 추가
      const newCategory = {
        firstCategory: firstCategory.first_category_id,
        secondCategory: null,
        thirdCategory: null
      };
      
      setTempSelectedCategories([...tempSelectedCategories, newCategory]);
    }
  };

  const handleSecondCategoryClick = (secondCategory) => {
    const isSelected = tempSelectedCategories.some(cat => 
      cat.firstCategory === expandedFirstCategory && 
      cat.secondCategory === secondCategory.second_category_id
    );
    
    if (isSelected) {
      // 제거
      const newTempSelected = tempSelectedCategories.filter(cat => 
        !(cat.firstCategory === expandedFirstCategory && cat.secondCategory === secondCategory.second_category_id)
      );
      setTempSelectedCategories(newTempSelected);
    } else {
      // 같은 대분류의 기존 카테고리가 있는지 확인 (대분류만 선택된 것 또는 중분류 선택된 것)
      const existingCategoryIndex = tempSelectedCategories.findIndex(cat => 
        cat.firstCategory === expandedFirstCategory
      );
      
      if (existingCategoryIndex !== -1) {
        // 같은 대분류의 기존 카테고리가 있으면 교체
        const newTempSelected = [...tempSelectedCategories];
        newTempSelected[existingCategoryIndex] = {
          firstCategory: expandedFirstCategory,
          secondCategory: secondCategory.second_category_id,
          thirdCategory: null
        };
        setTempSelectedCategories(newTempSelected);
      } else {
        // 새로운 카테고리 추가 (최대 3개까지만)
        if (tempSelectedCategories.length >= 3) {
          alert('최대 3개의 카테고리만 선택할 수 있습니다.');
          return;
        }
        
        const newCategory = {
          firstCategory: expandedFirstCategory,
          secondCategory: secondCategory.second_category_id,
          thirdCategory: null
        };
        
        setTempSelectedCategories([...tempSelectedCategories, newCategory]);
      }
    }
  };

  const handleThirdCategoryClick = (secondCategory, thirdCategory) => {
    const isCurrentlySelected = tempSelectedCategories.some(cat => 
      cat.firstCategory === secondCategory.first_category_id && 
      cat.secondCategory === secondCategory.second_category_id && 
      cat.thirdCategory === thirdCategory.third_category_id
    );
    
    if (isCurrentlySelected) {
      // 제거
      const newTempSelected = tempSelectedCategories.filter(cat => 
        !(cat.firstCategory === secondCategory.first_category_id && 
          cat.secondCategory === secondCategory.second_category_id && 
          cat.thirdCategory === thirdCategory.third_category_id)
      );
      setTempSelectedCategories(newTempSelected);
    } else {
      // 같은 중분류의 기존 카테고리가 있는지 확인
      const existingCategoryIndex = tempSelectedCategories.findIndex(cat => 
        cat.firstCategory === secondCategory.first_category_id && 
        cat.secondCategory === secondCategory.second_category_id
      );
      
      if (existingCategoryIndex !== -1) {
        // 같은 중분류의 기존 카테고리가 있으면 교체
        const newTempSelected = [...tempSelectedCategories];
        newTempSelected[existingCategoryIndex] = {
          firstCategory: secondCategory.first_category_id,
          secondCategory: secondCategory.second_category_id,
          thirdCategory: thirdCategory.third_category_id
        };
        setTempSelectedCategories(newTempSelected);
      } else {
        // 새로운 카테고리 추가 (최대 3개까지만)
        if (tempSelectedCategories.length >= 3) {
          alert('최대 3개의 카테고리만 선택할 수 있습니다.');
          return;
        }
        
        const newCategory = {
          firstCategory: secondCategory.first_category_id,
          secondCategory: secondCategory.second_category_id,
          thirdCategory: thirdCategory.third_category_id
        };
        
        setTempSelectedCategories([...tempSelectedCategories, newCategory]);
      }
    }
  };

  const handleApply = () => {
    if (onApply && tempSelectedCategories.length > 0) {
      onApply(tempSelectedCategories);
    }
  };

  const handleReset = () => {
    setSelectedFirstCategory(null);
    setSelectedSecondCategories([]);
    setSelectedThirdCategories([]);
    setTempSelectedCategories([]);
    setExpandedFirstCategory(null);
  };

  useEffect(() => {
    if (selectedCategories?.firstCategoryId) {
      setSelectedFirstCategory(selectedCategories.firstCategoryId);
    }
    if (selectedCategories?.secondCategoryId) {
      setSelectedSecondCategories([selectedCategories.secondCategoryId]);
    }
  }, [selectedCategories?.firstCategoryId, selectedCategories?.secondCategoryId]);

  const filteredSecondCategories = expandedFirstCategory 
    ? secondCategories.filter((second) => second.first_category_id === expandedFirstCategory)
    : [];

  if (!secondCategories || secondCategories.length === 0) {
    return (
      <div className="w-60 h-[50%] border p-4 bg-gray-50 lg:hidden">
        <p className="text-gray-500 text-sm">카테고리를 불러오는 중...</p>
      </div>
    );
  }

  // PC 버전 카테고리 메뉴
const DesktopCategoryMenu = () => (
  <div className="hidden lg:block w-52 h-auto border border-gray-200 rounded-lg p-4 bg-white shadow-sm overflow-y-auto mb-20">
    <h3 className="text-base font-bold text-gray-800">카테고리</h3>
    <div className="flex justify-around items-center my-2">
      
        <button
          onClick={handleReset}
          className="text-xs px-4 py-2 bg-gray-100 text-gray-600 rounded hover:shadow-md whitespace-nowrap"
        >
          초기화
        </button>
        <button
          onClick={handleApply}
          disabled={tempSelectedCategories.length === 0}
          className={`text-xs px-4 py-2 rounded ${
            tempSelectedCategories.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-main text-white hover:shadow-md whitespace-nowrap'
          }`}
        >
          적용 ({tempSelectedCategories.length})
        </button>
      </div>
    
    {/* 대분류 섹션 */}
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-600 mb-2">대분류</h4>
      <div className="space-y-1">
        {firstCategories.map((first) => {
          const isExpanded = expandedFirstCategory === first.first_category_id;
          const hasSelectedCategories = tempSelectedCategories.some(cat => cat.firstCategory === first.first_category_id);
          
          return (
            <div key={first.first_category_id}>
              <div 
                className={`p-2 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 ${
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
              </div>
              
              {/* 중분류 섹션 - 대분류가 펼쳐졌을 때만 표시 */}
              {isExpanded && (
                <div className="ml-4 mt-2 mb-2">
                  <h5 className="text-xs font-medium text-gray-500 mb-2">중분류</h5>
                  <div className="space-y-1">
                    {filteredSecondCategories.map((second) => {
                      const isSelectedSecond = tempSelectedCategories.some(cat => 
                        cat.firstCategory === expandedFirstCategory && 
                        cat.secondCategory === second.second_category_id
                      );
                      
                      return (
                        <div key={second.second_category_id}>
                          <div 
                            className={`p-2 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 ${
                              isSelectedSecond
                                ? ' text-blue-main font-semibold'
                                : 'text-gray-700 hover:text-blue-main'
                            }`}
                            onClick={() => handleSecondCategoryClick(second)}
                          >
                            <img 
                              src={isSelectedSecond ? checkBoxIcon : notCheckBoxIcon} 
                              alt="checkbox" 
                              className={`w-4 h-4`}
                            />
                            {second.name}
                          </div>
                          
                          {/* 소분류 (IT·개발이 아닌 경우에만) */}
                          {second.first_category_id !== 6 && isSelectedSecond && (
                            <div className="ml-4 mb-1">
                              <h6 className="text-xs font-medium text-gray-500 mb-1">소분류</h6>
                              <div className="space-y-1">
                                {thirdCategories.third_category
                                  .filter(third => third.second_category_id === second.second_category_id)
                                  .map((third) => {
                                    const isSelectedThird = tempSelectedCategories.some(cat => 
                                      cat.firstCategory === second.first_category_id && 
                                      cat.secondCategory === second.second_category_id && 
                                      cat.thirdCategory === third.third_category_id
                                    );
                                    
                                    return (
                                      <div 
                                        key={third.third_category_id} 
                                        className={`py-1 px-2 text-xs rounded cursor-pointer transition-colors flex items-center gap-2 ${
                                          isSelectedThird
                                            ? ' text-blue-main bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-main hover:bg-gray-50'
                                        }`}
                                        onClick={() => handleThirdCategoryClick(second, third)}
                                      >
                                        <img 
                                          src={isSelectedThird ? checkBoxIcon : notCheckBoxIcon} 
                                          alt="checkbox" 
                                          className={`w-3 h-3`}
                                        />
                                        {third.name}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>

    {/* 선택된 카테고리 표시 */}
    {tempSelectedCategories.length > 0 && (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h5 className="text-xs font-medium text-gray-600 mb-2">선택된 카테고리</h5>
        <div className="space-y-1">
          {tempSelectedCategories.map((cat, index) => {
            const firstCategory = firstCategories.find(f => f.first_category_id === cat.firstCategory);
            const secondCategory = secondCategories.find(s => s.second_category_id === cat.secondCategory);
            const thirdCategory = cat.thirdCategory ? 
              thirdCategories.third_category.find(t => t.third_category_id === cat.thirdCategory) : null;
            
            return (
              <div key={index} className="text-xs text-gray-700">
                {firstCategory?.name}
                {secondCategory ? ` › ${secondCategory.name}` : ' >'}
                {thirdCategory && ` › ${thirdCategory.name}`}
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);


  // 모바일 버전 카테고리 메뉴
  const MobileCategoryMenu = () => {
    return (
      <div className="block lg:hidden w-full bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-gray-800">카테고리</h3>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              초기화
            </button>
            <button
              onClick={handleApply}
              disabled={tempSelectedCategories.length === 0}
              className={`text-xs px-2 py-1 rounded ${
                tempSelectedCategories.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-main text-white hover:bg-blue-600'
              }`}
            >
              적용 ({tempSelectedCategories.length})
            </button>
          </div>
        </div>

        {/* 대분류 섹션 */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">대분류</h4>
          <div className="space-y-1">
            {firstCategories.map((first) => {
              const isExpanded = expandedFirstCategory === first.first_category_id;
              const hasSelectedCategories = tempSelectedCategories.some(cat => cat.firstCategory === first.first_category_id);
              
              return (
                <div key={first.first_category_id}>
                  <div 
                    className={`p-2 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 ${
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
                  </div>
                  
                  {/* 중분류 섹션 - 대분류가 펼쳐졌을 때만 표시 */}
                  {isExpanded && (
                    <div className="ml-4 mt-2 mb-2">
                      <h5 className="text-xs font-medium text-gray-500 mb-2">중분류</h5>
                      <div className="space-y-1">
                        {filteredSecondCategories.map((second) => {
                          const isSelectedSecond = tempSelectedCategories.some(cat => 
                            cat.firstCategory === expandedFirstCategory && 
                            cat.secondCategory === second.second_category_id
                          );
                          
                          return (
                            <div key={second.second_category_id}>
                              <div 
                                className={`p-2 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 ${
                                  isSelectedSecond
                                    ? ' text-blue-main font-semibold'
                                    : 'text-gray-700 hover:text-blue-main'
                                }`}
                                onClick={() => handleSecondCategoryClick(second)}
                              >
                                <img 
                                  src={isSelectedSecond ? checkBoxIcon : notCheckBoxIcon} 
                                  alt="checkbox" 
                                  className={`w-4 h-4`}
                                />
                                {second.name}
                              </div>
                              
                              {/* 소분류 (IT·개발이 아닌 경우에만) */}
                              {second.first_category_id !== 6 && isSelectedSecond && (
                                <div className="ml-4 mb-1">
                                  <h6 className="text-xs font-medium text-gray-500 mb-1">소분류</h6>
                                  <div className="space-y-1">
                                    {thirdCategories.third_category
                                      .filter(third => third.second_category_id === second.second_category_id)
                                      .map((third) => {
                                        const isSelectedThird = tempSelectedCategories.some(cat => 
                                          cat.firstCategory === second.first_category_id && 
                                          cat.secondCategory === second.second_category_id && 
                                          cat.thirdCategory === third.third_category_id
                                        );
                                        
                                        return (
                                          <div 
                                            key={third.third_category_id} 
                                            className={`py-1 px-2 text-xs rounded cursor-pointer transition-colors flex items-center gap-2 ${
                                              isSelectedThird
                                                ? ' text-blue-main bg-blue-50'
                                                : 'text-gray-600 hover:text-blue-main hover:bg-gray-50'
                                            }`}
                                            onClick={() => handleThirdCategoryClick(second, third)}
                                          >
                                            <img 
                                              src={isSelectedThird ? checkBoxIcon : notCheckBoxIcon} 
                                              alt="checkbox" 
                                              className={`w-3 h-3`}
                                            />
                                            {third.name}
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 선택된 카테고리 표시 */}
        {tempSelectedCategories.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="text-xs font-medium text-gray-600 mb-2">선택된 카테고리</h5>
            <div className="space-y-1">
              {tempSelectedCategories.map((cat, index) => {
                const firstCategory = firstCategories.find(f => f.first_category_id === cat.firstCategory);
                const secondCategory = secondCategories.find(s => s.second_category_id === cat.secondCategory);
                const thirdCategory = cat.thirdCategory ? 
                  thirdCategories.third_category.find(t => t.third_category_id === cat.thirdCategory) : null;
                
                return (
                  <div key={index} className="text-xs text-gray-700">
                    {firstCategory?.name}
                    {secondCategory ? ` › ${secondCategory.name}` : ' >'}
                    {thirdCategory && ` › ${thirdCategory.name}`}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
