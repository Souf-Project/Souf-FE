import React, { useState, useEffect } from "react";
import firstCategoryData from "../assets/categoryIndex/first_category.json";
import secondCategoryData from "../assets/categoryIndex/second_category.json";
import thirdCategoryData from "../assets/categoryIndex/third_category.json";

export default function CategorySelectBox({
  title,
  content,
  defaultValue = {
    firstCategory: null,
    secondCategory: null,
    thirdCategory: null
  },
  type = "mypage",
  onChange,
  isEditing = false,
  width ="",
}) {
  const [selectedValue, setSelectedValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [selectedSubSubOption, setSelectedSubSubOption] = useState(null);

  useEffect(() => {
    if (defaultValue.firstCategory) {
      const firstCat = options.find(opt => opt.id === defaultValue.firstCategory);
      if (firstCat) {
        setSelectedOption(firstCat);
        if (defaultValue.secondCategory) {
          const secondCat = firstCat.subOptions.find(opt => opt.id === defaultValue.secondCategory);
          if (secondCat) {
            setSelectedSubOption(secondCat);
            if (defaultValue.thirdCategory) {
              const thirdCat = secondCat.subOptions.find(opt => opt.id === defaultValue.thirdCategory);
              if (thirdCat) {
                setSelectedSubSubOption(thirdCat);
                setSelectedValue(`${firstCat.name}\n${secondCat.name}\n${thirdCat.name}`);
              }
            } else {
              setSelectedValue(`${firstCat.name}\n${secondCat.name}`);
            }
          }
        } else {
          setSelectedValue(firstCat.name);
        }
      }
    }
  }, [defaultValue]);

  // 카테고리 데이터 구조화
  const buildCategoryStructure = () => {
    const firstCategories = firstCategoryData.first_category;
    const secondCategories = secondCategoryData.second_category;
    const thirdCategories = thirdCategoryData.third_category;

    return firstCategories.map((firstCat) => {
      const secondCats = secondCategories
        .filter(
          (secondCat) =>
            secondCat.first_category_id === firstCat.first_category_id
        )
        .map((secondCat) => {
          const thirdCats = thirdCategories
            .filter(
              (thirdCat) =>
                thirdCat.second_category_id === secondCat.second_category_id
            )
            .map((thirdCat) => ({
              id: thirdCat.third_category_id,
              name: thirdCat.name,
            }));

          return {
            id: secondCat.second_category_id,
            name: secondCat.name,
            subOptions: thirdCats,
          };
        });

      return {
        id: firstCat.first_category_id,
        name: firstCat.name,
        subOptions: secondCats,
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
        firstCategory: selectedOption.id,
        secondCategory: selectedSubOption.id,
        thirdCategory: selectedSubSubOption.id
      };
    } else if (selectedSubOption) {
      return {
        firstCategory: selectedOption.id,
        secondCategory: selectedSubOption.id,
        thirdCategory: null
      };
    } else if (selectedOption) {
      return {
        firstCategory: selectedOption.id,
        secondCategory: null,
        thirdCategory: null
      };
    }
    return {
      firstCategory: null,
      secondCategory: null,
      thirdCategory: null
    };
  };

  const handleSave = () => {
    const valueToSave = getValueToSave();
    console.log('CategorySelectBox - 선택된 카테고리 값:', valueToSave);
    
    // 선택된 카테고리들을 계층적으로 표시
    let displayValue = "";
    if (selectedSubSubOption) {
      displayValue = `${selectedOption.name}\n${selectedSubOption.name}\n${selectedSubSubOption.name}`;
    } else if (selectedSubOption) {
      displayValue = `${selectedOption.name}\n${selectedSubOption.name}`;
    } else if (selectedOption) {
      displayValue = selectedOption.name;
    } else {
      displayValue = "카테고리 선택";
    }
    
    setSelectedValue(displayValue);
    if (onChange) {
      onChange(valueToSave);
    }
    setShowModal(false);
  };

  // 옵션 버튼 스타일
  const getOptionButtonStyle = (option) => {
    if (selectedOption?.id === option.id) {
      return selectedSubOption || selectedSubSubOption
        ? "bg-blue-200 text-black"
        : "bg-blue-main text-white";
    }
    return "hover:bg-gray-100 border border-grey-border";
  };

  const getSubOptionButtonStyle = (subOption) => {
    if (selectedSubOption?.id === subOption.id) {
      return selectedSubSubOption
        ? "bg-blue-200 text-black"
        : "bg-blue-main text-white";
    }
    return "hover:bg-gray-100 border border-grey-border";
  };

  const getSubSubOptionButtonStyle = (subSubOption) => {
    if (selectedSubSubOption?.id === subSubOption.id) {
      return "bg-blue-main text-white";
    }
    return "hover:bg-gray-100 border border-grey-border";
  };

  return (
    <div className={`relative ${type === "join" && "w-full"} ${width}`}>
      <div
        className={`flex items-center rounded-md border overflow-hidden ${
          isEditing ? 'cursor-pointer bg-white hover:bg-[#F0F0F0]' : 'cursor-not-allowed bg-[#F7F7F7]'
        } ${
          type === "join" ? "border-[#FFC400] w-full" : "border-grey-border"
        }`}
        onClick={() => isEditing && setShowModal(true)}
      >
        <div className={`flex-1 p-5 text-center ${
          isEditing ? 'text-black' : 'text-gray-600'
        }`}>
          <div className="whitespace-pre-line">
            {selectedValue ? (
              <div className="space-y-1">
                {selectedValue.split('\n').map((category, index, array) => {
                  const isLast = index === array.length - 1;
                  return (
                    <div
                      key={index}
                      className={`${
                        isLast 
                          ? 'text-black font-semibold text-base' 
                          : 'text-gray-500 text-sm'
                      }`}
                    >
                      {category}
                    </div>
                  );
                })}
              </div>
            ) : (
              "카테고리 선택"
            )}
          </div>
        </div>
      </div>

      {/* 선택 모달 */}
      {showModal && isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[50rem] category-modal">
            <style>
              {`
                @keyframes slideInFromLeft {
                  0% {
                    opacity: 0;
                    transform: translateX(-20px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }
                
                @keyframes fadeIn {
                  0% {
                    opacity: 0;
                  }
                  100% {
                    opacity: 1;
                  }
                }
                
                .category-modal {
                  animation: fadeIn 0.3s ease-out;
                }
              `}
            </style>
            <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">카테고리 선택</h3>
            <span className="text-sm text-gray-500">대분류, 중분류, 소분류 중 하나만 선택하면 됩니다.</span>
            </div>
            
                         <div className="flex space-x-8">
               {/* 첫 번째 열 - 기본 옵션 */}
               <div className="flex flex-col w-1/3">
                 {options.map((option) => (
                   <button
                     key={option.id}
                     className={`text-left p-3 my-1 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${getOptionButtonStyle(
                       option
                     )}`}
                     onClick={() => handleOptionSelect(option)}
                   >
                     {option.name}
                   </button>
                 ))}
               </div>

               {/* 두 번째 열 - 서브 옵션 */}
               <div className={`flex flex-col w-1/3 transition-all duration-500 ease-in-out ${
                 selectedOption && selectedOption.subOptions.length > 0 
                   ? 'opacity-100 translate-x-0' 
                   : 'opacity-0 translate-x-4 pointer-events-none'
               }`}>
                 {selectedOption && selectedOption.subOptions.length > 0 && (
                   <>
                     {selectedOption.subOptions.map((subOption, index) => (
                       <button
                         key={subOption.id}
                         className={`text-left p-3 my-1 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
                           getSubOptionButtonStyle(subOption)
                         }`}
                         style={{
                           animationDelay: `${index * 50}ms`,
                           animation: 'slideInFromLeft 0.3s ease-out forwards'
                         }}
                         onClick={() => handleSubOptionSelect(subOption)}
                       >
                         {subOption.name}
                       </button>
                     ))}
                   </>
                 )}
               </div>

               {/* 세 번째 열 - 서브서브 옵션 */}
               <div className={`flex flex-col w-1/3 transition-all duration-500 ease-in-out ${
                 selectedSubOption &&
                 selectedSubOption.subOptions &&
                 selectedSubOption.subOptions.length > 0
                   ? 'opacity-100 translate-x-0' 
                   : 'opacity-0 translate-x-4 pointer-events-none'
               }`}>
                 {selectedSubOption &&
                   selectedSubOption.subOptions &&
                   selectedSubOption.subOptions.length > 0 && (
                     <>
                       {selectedSubOption.subOptions.map((subSubOption, index) => (
                         <button
                           key={subSubOption.id}
                           className={`text-left p-3 my-1 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
                             getSubSubOptionButtonStyle(subSubOption)
                           }`}
                           style={{
                             animationDelay: `${index * 50}ms`,
                             animation: 'slideInFromLeft 0.3s ease-out forwards'
                           }}
                           onClick={() => handleSubSubOptionSelect(subSubOption)}
                         >
                           {subSubOption.name}
                         </button>
                       ))}
                     </>
                   )}
               </div>
             </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
              <button
                className={`bg-blue-main text-white px-4 py-2 rounded-md ${
                  !getValueToSave() ? "opacity-50 cursor-not-allowed" : ""
                }`}
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
