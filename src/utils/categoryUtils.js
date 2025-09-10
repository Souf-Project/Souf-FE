// utils/categoryUtils.js
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../assets/categoryIndex/third_category.json';


//가장 하위 카테고리만 반환
export const getLastCategoryName = (dto) => {
  if (!dto) return '';

  const firstName = firstCategoryData.first_category.find(
    (cat) => cat.first_category_id === dto.firstCategory
  )?.name || '';

  const secondName = secondCategoryData.second_category.find(
    (cat) => cat.second_category_id === dto.secondCategory
  )?.name || '';

  const thirdName = thirdCategoryData.third_category.find(
    (cat) => cat.third_category_id === dto.thirdCategory
  )?.name || '';

  // third → second → first 순으로 우선 반환
  if (thirdName) return thirdName;
  if (secondName) return secondName;
  return firstName;
};

export const getAllCategoryNames = (categoryDtoList) => {
    if (!categoryDtoList || categoryDtoList.length === 0) {
        return [];
    }

    return categoryDtoList.map(dto => {
        const firstCatId = dto.firstCategory;
        const secondCatId = dto.secondCategory;
        const thirdCatId = dto.thirdCategory;

        const firstName = firstCategoryData.first_category.find(
            cat => cat.first_category_id === firstCatId
        )?.name || '';

        const secondName = secondCategoryData.second_category.find(
            cat => cat.second_category_id === secondCatId
        )?.name || '';

        const thirdName = thirdCategoryData.third_category.find(
            cat => cat.third_category_id === thirdCatId
        )?.name || '';

        return { first: firstName, second: secondName, third: thirdName };
    });
};



//배열로 반환
export const getCategoryNames = (categoryDtoList) => {
  if (!categoryDtoList || categoryDtoList.length === 0) return [];
  return categoryDtoList.map((dto) => getLastCategoryName(dto));
};
