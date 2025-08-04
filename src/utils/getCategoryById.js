// utils/categoryUtils.js

import FirstCategory from "../assets/categoryIndex/first_category.json";
import SecondCategory from "../assets/categoryIndex/second_category.json";
import ThirdCategory from "../assets/categoryIndex/third_category.json";

// 이름으로 first_category_id 찾기
export const getFirstCategoryId = (name) => {
  const category = FirstCategory.first_category.find((cat) => {
    if (typeof name !== "string" || typeof cat.name !== "string") return false;
    return cat.name.trim() === name.trim();
  });

  return category ? category.first_category_id : 0;
};

// 이름으로 second_category_id 찾기
export const getSecondCategoryId = (name) => {
  const category = SecondCategory.second_category.find(
    (cat) => cat.name.trim() === name.trim()
  );
  return category ? category.second_category_id : 0;
};

// 이름으로 third_category_id 찾기
export const getThirdCategoryId = (name) => {
  const category = ThirdCategory.third_category.find(
    (cat) => cat.name.trim() === name.trim()
  );
  return category ? category.third_category_id : 0;
};

// 특정 first_category_id에 속한 second_category 배열 가져오기
export const getSecondCategoriesByFirstId = (firstCategoryId) => {
  return SecondCategory.second_category.filter(
    (cat) => cat.first_category_id === firstCategoryId
  );
};

// first_category_id로 이름 찾기 함수 추가
export const getFirstCategoryNameById = (id) => {
  const category = FirstCategory.first_category.find(
    (cat) => cat.first_category_id === id
  );
  return category ? category.name : null;
};

export const getSecondCategoryNameById = (id) => {
  const category = SecondCategory.second_category.find(
    (cat) => cat.second_category_id === id
  );
  return category ? category.name : null;
};


// feed,profile, recruit 으로 해서 한국어 반환해주기

export const getNowPageByActiveTab = (activeTab) => {
  if(activeTab === 'feed'){
    return "대학생 피드"
  }else if(activeTab === 'profile'){
    return "대학생 프로필"
  }else{
    return "기업 공고문"
  }
}