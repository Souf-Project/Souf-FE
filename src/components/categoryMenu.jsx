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

  // PC 버전 카테고리 메뉴 (가로 형태)
  const DesktopCategoryMenu = () => (
    <div className="hidden lg:block w-full bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-8">
          {secondCategories.map((second) => (
            <div key={second.second_category_id} className="relative group">
              <div className="cursor-pointer font-semibold text-gray-700 hover:text-yellow-point transition-colors py-2">
                <span>{second.name}</span>
                <svg
                  className="inline-block w-4 h-4 ml-1 transition-transform group-hover:rotate-180"
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

              {/* 드롭다운 메뉴 */}
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {thirdCategories.third_category
                  .filter(
                    (third) =>
                      third.second_category_id === second.second_category_id
                  )
                  .map((third) => (
                    <div 
                      key={third.third_category_id} 
                      className="px-4 py-2 text-sm text-gray-600 hover:text-yellow-point hover:bg-yellow-50 cursor-pointer transition-colors"
                      onClick={() => handleThirdCategoryClick(second, third)}
                    >
                      {third.name}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 모바일 버전 카테고리 메뉴 (박스 형태)
  const MobileCategoryMenu = () => (
    <div className="block lg:hidden w-60 h-[50%] border border-gray-200 rounded-lg p-4 bg-white shadow-sm overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4">카테고리</h3>
      {secondCategories.map((second) => (
        <div key={second.second_category_id} className="mb-3">
          <div
            className="cursor-pointer font-semibold text-sm flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
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

  return (
    <>
      <DesktopCategoryMenu />
      <MobileCategoryMenu />
    </>
  );
};

export default CategoryMenu;
