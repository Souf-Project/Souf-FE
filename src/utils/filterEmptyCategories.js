export const filterEmptyCategories = (categoryDtos) => {
  return categoryDtos
    .map((category) => {
      const cleaned = {};
      if (category.firstCategory !== null)
        cleaned.firstCategory = category.firstCategory;
      if (category.secondCategory !== null)
        cleaned.secondCategory = category.secondCategory;
      if (category.thirdCategory !== null)
        cleaned.thirdCategory = category.thirdCategory;
      return Object.keys(cleaned).length > 0 ? cleaned : null;
    })
    .filter(Boolean); // null 제거
};
