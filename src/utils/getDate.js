//2025-06-20T01:41: ... 같은 형식 -> 25.06.20 변환 함수
export const getFormattedDate = (lastModifiedTime) => {
  var year = lastModifiedTime.substring(2, 4);
  var month = lastModifiedTime.substring(5, 7);
  var day = lastModifiedTime.substring(8, 10);
  return year + "." + month + "." + day;
};

//d-day 함수
export const calculateDday = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const timeDiff = deadlineDate - today;
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (dayDiff <= 0) {
    return "마감";
  } else {
    return `D-${dayDiff}`;
  }
};
