//2025-06-20T01:41: ... 같은 형식 -> 25.06.20 변환 함수
export const getFormattedDate = (lastModifiedTime) => {
  var year = lastModifiedTime?.substring(2, 4);
  var month = lastModifiedTime?.substring(5, 7);
  var day = lastModifiedTime?.substring(8, 10);
  return year + "." + month + "." + day;
};

//d-day 함수
export const calculateDday = (deadline, recruitable) => {

  if (recruitable === false) return "마감";
  
  if (!deadline) return "마감";
  
  // deadline이 숫자인 경우 직접 처리 (음수는 절댓값으로 처리)
  if (typeof deadline === 'number') {
    const daysLeft = Math.abs(deadline);
    if (daysLeft <= 0) {
      return "마감";
    } else {
      return `D-${daysLeft}`;
    }
  }
  
  const today = new Date();
  const deadlineDate = new Date(deadline);
  
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
  
  const timeDiff = deadlineDateOnly - todayDate;
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  if (dayDiff <= 0) {
    return "마감";
  } else {
    return `D-${dayDiff}`;
  }
};
