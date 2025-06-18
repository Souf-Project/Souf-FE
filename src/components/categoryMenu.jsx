import React, { useEffect, useState } from "react";

const CategoryMenu = ({ secondCategories, thirdCategories }) => {
  const [openSecondCategory, setOpenSecondCategory] = useState(null);

  const toggleSecondCategory = (id) => {
    setOpenSecondCategory((prev) => (prev === id ? null : id));
  };

  console.log(secondCategories);
  return (
    <div className="w-60 h-[50%] border p-4">
      {secondCategories.map((second) => (
        <div key={second.second_category_id} className="mb-2">
          <div
            className="cursor-pointer font-bold text-sm flex items-center"
            onClick={() => toggleSecondCategory(second.second_category_id)}
          >
            {second.name}
            <svg
              className={`ml-2 w-4 h-4 transition-transform ${
                openSecondCategory === second.second_category_id
                  ? "rotate-180"
                  : ""
              }
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {openSecondCategory === second.second_category_id && (
            <ul className="ml-3 mt-1 text-xs text-gray-700">
              {thirdCategories.third_category
                .filter(
                  (third) =>
                    third.second_category_id === second.second_category_id
                )
                .map((third) => (
                  <li key={third.third_category_id} className="py-1">
                    {third.name}
                  </li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
