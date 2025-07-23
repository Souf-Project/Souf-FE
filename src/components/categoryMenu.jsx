import React, { useState } from "react";

const CategoryMenu = ({ secondCategories, thirdCategories, onSelect }) => {
  const [openSecondCategory, setOpenSecondCategory] = useState(null);

  const toggleSecondCategory = (id) => {
    setOpenSecondCategory((prev) => (prev === id ? null : id));
  };

  const handleThirdCategoryClick = (secondCategory, thirdCategory) => {
    if (onSelect) {
      onSelect(secondCategory.first_category_id, secondCategory.second_category_id, thirdCategory.third_category_id);
    }
  };

  if (!secondCategories || secondCategories.length === 0) {
    return (
      <div className="w-60 h-[50%] border p-4 bg-gray-50 lg:hidden">
        <p className="text-gray-500 text-sm">카테고리를 불러오는 중...</p>
      </div>
    );
  }

  // PC 버전 카테고리 메뉴 (박스 형태)
  const DesktopCategoryMenu = () => (
    <div className="hidden lg:block w-60 h-auto border border-gray-200 rounded-lg p-4 bg-white shadow-sm overflow-y-auto">
      <h3 className="text-lg lg:text-2xl font-bold text-gray-800 mb-4">카테고리</h3>
      {secondCategories.map((second) => (
        <div key={second.second_category_id} className="mb-3">
          <div
            className="cursor-pointer font-semibold text-sm lg:text-base flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
            onClick={() => toggleSecondCategory(second.second_category_id)}
          >
            <span className="text-gray-700">{second.name}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                openSecondCategory === second.second_category_id
                  ? "rotate-180"
                  : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {openSecondCategory === second.second_category_id && (
            <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-3">
              {thirdCategories.third_category
                .filter(
                  (third) =>
                    third.second_category_id === second.second_category_id
                )
                .map((third) => (
                  <div 
                    key={third.third_category_id} 
                    className="py-1 px-2 text-xs text-gray-600 hover:text-yellow-point hover:bg-yellow-50 rounded cursor-pointer transition-colors"
                    onClick={() => handleThirdCategoryClick(second, third)}
                  >
                    {third.name}
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // 모바일 버전 카테고리 메뉴 (좌우 반반)
  const MobileCategoryMenu = () => {
    const [selectedSecondCategory, setSelectedSecondCategory] = useState(null);

    const handleSecondCategoryClick = (second) => {
      setSelectedSecondCategory(second);
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
          {/* 왼쪽: 중분류 */}
          <div className="w-1/2 border-r border-gray-200 bg-gray-50">
           
            <div className="overflow-y-auto h-full">
              {secondCategories.map((second) => (
                <div
                  key={second.second_category_id}
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedSecondCategory?.second_category_id === second.second_category_id
                      ? "bg-yellow-point text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => handleSecondCategoryClick(second)}
                >
                  <span className="text-sm font-medium">{second.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 소분류 */}
          <div className="w-1/2">
            
            <div className="overflow-y-auto h-full">
              {selectedSecondCategory ? (
                getThirdCategories().map((third) => (
                  <div
                    key={third.third_category_id}
                    className="p-3 cursor-pointer hover:bg-yellow-50 hover:text-yellow-point transition-colors text-gray-700"
                    onClick={() => handleThirdCategoryClick(selectedSecondCategory, third)}
                  >
                    <span className="text-sm">{third.name}</span>
                  </div>
                ))
              ) : (
                <div/>
              )}
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
