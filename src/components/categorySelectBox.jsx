import React, { useState, useEffect } from 'react';
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../assets/categoryIndex/third_category.json';

export default function CategorySelectBox({title, content, defaultValue = "", type, onChange}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [selectedSubSubOption, setSelectedSubSubOption] = useState(null);
  
  // 카테고리 데이터 구조화
  const buildCategoryStructure = () => {
    const firstCategories = firstCategoryData.first_category;
    const secondCategories = secondCategoryData.second_category;
    const thirdCategories = thirdCategoryData.third_category;

    return firstCategories.map(firstCat => {
      const secondCats = secondCategories
        .filter(secondCat => secondCat.first_category_id === firstCat.first_category_id)
        .map(secondCat => {
          const thirdCats = thirdCategories
            .filter(thirdCat => thirdCat.second_category_id === secondCat.second_category_id)
            .map(thirdCat => ({
              id: thirdCat.third_category_id,
              name: thirdCat.name
            }));

          return {
            id: secondCat.second_category_id,
            name: secondCat.name,
            subOptions: thirdCats
          };
        });

      return {
        id: firstCat.first_category_id,
        name: firstCat.name,
        subOptions: secondCats
      };
    });
  };

  const options = buildCategoryStructure();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setSelectedSubOption(null);
    setSelectedSubSubOption(null);
  };

  const handleSubOptionSelect = (subOption) => {
    setSelectedSubOption(subOption);
    setSelectedSubSubOption(null);
  };

  const handleSubSubOptionSelect = (subSubOption) => {
    setSelectedSubSubOption(subSubOption);
  };

  const getValueToSave = () => {
    if (selectedSubSubOption) {
      return {
        firstCategoryId: selectedOption.id,
        secondCategoryId: selectedSubOption.id,
        thirdCategoryId: selectedSubSubOption.id,
        name: selectedSubSubOption.name
      };
    } else if (selectedSubOption) {
      return {
        firstCategoryId: selectedOption.id,
        secondCategoryId: selectedSubOption.id,
        name: selectedSubOption.name
      };
    } else if (selectedOption) {
      return {
        firstCategoryId: selectedOption.id,
        name: selectedOption.name
      };
    }
    return null;
  };

  const handleSave = () => {
    const valueToSave = getValueToSave();
    if (valueToSave) {
      setSelectedValue(valueToSave.name);
      if (onChange) {
        onChange(valueToSave);
      }
    }
    setShowModal(false);
    setSelectedOption(null);
    setSelectedSubOption(null);
    setSelectedSubSubOption(null);
  };

  // 옵션 버튼 스타일
  const getOptionButtonStyle = (option) => {
    if (selectedOption?.id === option.id) {
      return (selectedSubOption || selectedSubSubOption) ? 'bg-yellow-main text-black' : 'bg-yellow-point text-white';
    }
    return 'hover:bg-gray-100 border border-grey-border';
  };

  const getSubOptionButtonStyle = (subOption) => {
    if (selectedSubOption?.id === subOption.id) {
      return selectedSubSubOption ? 'bg-yellow-main text-black' : 'bg-yellow-point text-white';
    }
    return 'hover:bg-gray-100 border border-grey-border';
  };

  const getSubSubOptionButtonStyle = (subSubOption) => {
    if (selectedSubSubOption?.id === subSubOption.id) {
      return 'bg-yellow-point text-white';
    }
    return 'hover:bg-gray-100 border border-grey-border';
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center rounded-md bg-white border border-grey-border overflow-hidden cursor-pointer hover:bg-[#F0F0F0]"
        onClick={() => setShowModal(true)}
      >
        <div className="flex-1 p-5 pl-7">
          {selectedValue || "카테고리 선택"}
        </div>
      </div>

      {/* 선택 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[50rem]">
            <h3 className="text-xl font-semibold mb-4">카테고리 선택</h3>
            <div className="flex space-x-8">
              {/* 첫 번째 열 - 기본 옵션 */}
              <div className="flex flex-col w-1/3">
                {options.map((option) => (
                  <button
                    key={option.id}
                    className={`text-left p-3 my-1 rounded-md ${getOptionButtonStyle(option)}`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
              
              {/* 두 번째 열 - 서브 옵션 */}
              {selectedOption && selectedOption.subOptions.length > 0 && (
                <div className="flex flex-col w-1/3">
                  {selectedOption.subOptions.map((subOption) => (
                    <button
                      key={subOption.id}
                      className={`text-left p-3 my-1 rounded-md ${getSubOptionButtonStyle(subOption)}`}
                      onClick={() => handleSubOptionSelect(subOption)}
                    >
                      {subOption.name}
                    </button>
                  ))}
                </div>
              )}
              
              {/* 세 번째 열 - 서브서브 옵션 */}
              {selectedSubOption && selectedSubOption.subOptions && selectedSubOption.subOptions.length > 0 && (
                <div className="flex flex-col w-1/3">
                  {selectedSubOption.subOptions.map((subSubOption) => (
                    <button
                      key={subSubOption.id}
                      className={`text-left p-3 my-1 rounded-md ${getSubSubOptionButtonStyle(subSubOption)}`}
                      onClick={() => handleSubSubOptionSelect(subSubOption)}
                    >
                      {subSubOption.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
              <button
                className={`bg-yellow-point text-white px-4 py-2 rounded-md ${!getValueToSave() ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSave}
                disabled={!getValueToSave()}
              >
                선택 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}