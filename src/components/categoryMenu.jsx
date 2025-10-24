import React, { useState, useEffect } from "react";
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import checkBoxIcon from '../assets/images/checkBoxIcon.svg';
import notCheckBoxIcon from '../assets/images/notCheckBoxIcon.svg';

const CategoryMenu = ({ secondCategories, thirdCategories, onSelect, selectedCategories, onApply }) => {
  const [selectedFirstCategory, setSelectedFirstCategory] = useState(selectedCategories?.firstCategoryId || 1); // 초기값 1로 설정
  const [selectedSecondCategories, setSelectedSecondCategories] = useState(selectedCategories?.secondCategoryId ? [selectedCategories.secondCategoryId] : []);
  const [selectedThirdCategories, setSelectedThirdCategories] = useState(selectedCategories?.thirdCategoryId ? [selectedCategories.thirdCategoryId] : []);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [expandedFirstCategory, setExpandedFirstCategory] = useState(selectedCategories?.firstCategoryId || 1); // 초기값 1로 설정

  const firstCategories = firstCategoryData.first_category;

  const handleFirstCategoryClick = (firstCategory) => {
    // 라디오 버튼 방식: 항상 선택되고 펼쳐짐
    setSelectedFirstCategory(firstCategory.first_category_id);
    setExpandedFirstCategory(firstCategory.first_category_id);
    
    // 기존에 선택된 같은 대분류의 카테고리들을 제거하고 새로운 대분류만 선택
    const newTempSelected = tempSelectedCategories.filter(cat => 
      cat.firstCategory !== firstCategory.first_category_id
    );
    
    // 대분류만 선택된 카테고리 추가
    const newCategory = {
      firstCategory: firstCategory.first_category_id,
      secondCategory: null,
      thirdCategory: null
    };
    
    setTempSelectedCategories([...newTempSelected, newCategory]);
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
    setSelectedFirstCategory(1); // 초기값 1로 리셋
    setSelectedSecondCategories([]);
    setSelectedThirdCategories([]);
    setTempSelectedCategories([{
      firstCategory: 1,
      secondCategory: null,
      thirdCategory: null
    }]);
    setExpandedFirstCategory(1); // 초기값 1로 리셋
  };

  useEffect(() => {
    if (selectedCategories?.firstCategoryId) {
      setSelectedFirstCategory(selectedCategories.firstCategoryId);
      setExpandedFirstCategory(selectedCategories.firstCategoryId);
    }
    if (selectedCategories?.secondCategoryId) {
      setSelectedSecondCategories([selectedCategories.secondCategoryId]);
    }
    
    // 초기값 설정 (대분류 1번이 기본 선택)
    if (!selectedCategories?.firstCategoryId) {
      setTempSelectedCategories([{
        firstCategory: 1,
        secondCategory: null,
        thirdCategory: null
      }]);
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

  return (
  <div className="w-full h-auto border border-gray-200 rounded-lg p-4 bg-white shadow-sm">

    <div className="flex justify-between items-center mb-4">
      <h3 className="text-base font-bold text-gray-800">카테고리</h3>
      <div className="flex gap-2">
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
       
    </div>
   
    {/* 대분류 선택  */}
    <div className="flex gap-2">
      <div className="flex flex-col w-1/4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">대분류 (필수 선택)</h4>
        {firstCategories.map((first) => {
          const isExpanded = expandedFirstCategory === first.first_category_id;
          const isSelected = selectedFirstCategory === first.first_category_id;
          
          return (
            <div key={`desktop-first-${first.first_category_id}`}>
              <div 
                className={`p-2 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 ${
                  isSelected
                    ? 'text-blue-main font-semibold bg-blue-50'
                    : 'text-gray-700 hover:text-blue-main hover:bg-gray-50'
                }`}
                onClick={() => handleFirstCategoryClick(first)}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isSelected 
                    ? 'border-blue-main bg-blue-main' 
                    : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                {first.name}
              </div>
            </div>
          );
        })}


      </div>

{/* 중분류 섹션 - 선택된 대분류에 따라 표시 */}
{expandedFirstCategory && (
      <div className="flex flex-col w-1/3">
         <h5 className="text-sm font-semibold text-gray-500 mb-2">중분류</h5>
          {filteredSecondCategories.map((second) => {
            const isSelectedSecond = tempSelectedCategories.some(cat => 
              cat.firstCategory === expandedFirstCategory && 
              cat.secondCategory === second.second_category_id
            );
            
            return (
              <div key={`desktop-second-${second.second_category_id}`}>
                <div 
                  className={`p-2 rounded cursor-pointer transition-colors text-sm flex items-center gap-2 ${
                    isSelectedSecond
                      ? 'text-blue-main font-semibold bg-blue-50'
                      : 'text-gray-700 hover:text-blue-main hover:bg-gray-50'
                  }`}
                  onClick={() => handleSecondCategoryClick(second)}
                >
                  <img 
                    src={isSelectedSecond ? checkBoxIcon : notCheckBoxIcon} 
                    alt="checkbox" 
                    className="w-4 h-4"
                  />
                  {second.name}
                </div>
              </div>
            );
          })}
        </div>
    )}

    {/* 소분류 섹션 - 선택된 중분류에 따라 표시 */}
    {(() => {
      const selectedSecondCategories = filteredSecondCategories.filter(second => 
        tempSelectedCategories.some(cat => 
          cat.firstCategory === expandedFirstCategory && 
          cat.secondCategory === second.second_category_id &&
          second.first_category_id !== 6
        )
      );
      
      if (selectedSecondCategories.length > 0) {
        return (
          <div className="flex flex-col w-1/3 ">
            <h6 className="text-sm font-semibold text-gray-500 mb-2">소분류</h6>
            <div className="flex flex-col h-[300px] overflow-y-auto">
              {selectedSecondCategories.map(second => 
                thirdCategories.third_category
                  .filter(third => third.second_category_id === second.second_category_id)
                  .map((third) => {
                    const isSelectedThird = tempSelectedCategories.some(cat => 
                      cat.firstCategory === second.first_category_id && 
                      cat.secondCategory === second.second_category_id && 
                      cat.thirdCategory === third.third_category_id
                    );
                    
                    return (
                      <div 
                        key={`desktop-third-${third.third_category_id}`} 
                        className={`p-2 text-sm rounded cursor-pointer transition-colors flex items-center gap-2 ${
                          isSelectedThird
                            ? 'text-blue-main bg-blue-50'
                            : 'text-gray-600 hover:text-blue-main hover:bg-gray-50'
                        }`}
                        onClick={() => handleThirdCategoryClick(second, third)}
                      >
                        <img 
                          src={isSelectedThird ? checkBoxIcon : notCheckBoxIcon} 
                          alt="checkbox" 
                          className="w-4 h-4"
                        />
                        {third.name}
                      </div>
                    );
                  })
              )}
            </div>
            </div>
        );
      }
      return null;
    })()}
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
            
            // 고유한 key 생성
            const uniqueKey = `${cat.firstCategory}-${cat.secondCategory || 'null'}-${cat.thirdCategory || 'null'}-${index}`;
            
            return (
              <div key={uniqueKey} className="text-xs text-gray-700">
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

export default CategoryMenu;
