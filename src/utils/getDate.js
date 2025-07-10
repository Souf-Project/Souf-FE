//2025-06-20T01:41: ... 같은 형식 -> 25.06.20 변환 함수
export const getFormattedDate = (lastModifiedTime) => {
  var year = lastModifiedTime?.substring(2, 4);
  var month = lastModifiedTime?.substring(5, 7);
  var day = lastModifiedTime?.substring(8, 10);
  return year + "." + month + "." + day;
};

//d-day 함수
export const calculateDday = (deadline, recruitable) => {
  // recruitable이 false이면 마감
  if (recruitable === false) return "마감";
  
  // deadline이 없으면 마감
  if (!deadline) return "마감";
  
  const today = new Date();
  const deadlineDate = new Date(deadline);
  
  // 시간을 제거하고 날짜만 비교
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
  
  const timeDiff = deadlineDateOnly - todayDate;
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  // deadline이 지났으면 마감
  if (dayDiff <= 0) {
    return "마감";
  } else {
    return `D-${dayDiff}`;
  }
};
