export const FAVORITE_ERRORS = {
  "M404-1": {
    message: `존재하지 않는 사용자입니다.\n문제가 계속된다면 로그아웃 후 다시 시도해주세요.`,
    action: "redirect",
  },
  "M404-2": {
    message: `즐겨찾기한 사용자가 아닙니다.`,
    action: "refresh", //아님 refresh?
  },
};

//"올바르지 않은 계정입니다\n이메일 정보를 확인해주세요.",
export const MEMBER_ERRORS = {
  "M404-1": {
    message: `올바르지 않은 계정입니다.\n문제가 계속된다면 로그아웃 후 다시 시도해주세요.`,
    action: "redirect",
  },
  "M400-4": {
    message: `유효하지 않은 이메일 형식입니다.`,
    action: null, //아님 refresh?
  },
 "C404-1": {
    message: "올바르지 않은 대분류 카테고리가 포함되어 있습니다.",
    action: "refresh", 
  },
  "C404-2": {
    message: "올바르지 않은 중분류 카테고리가 포함되어 있습니다.",
    action: "refresh",
  },
  "C404-3": {
    message: "올바르지 않은 소분류 카테고리가 포함되어 있습니다.",
    action: "refresh",
  },
  "C400-1": {
    message: `올바르지 않은 카테고리 조합입니다.\n상위 카테고리를 먼저 선택해주세요.`,
    action: "refresh", 
  },
  "C400-2": {
    message: `올바르지 않은 카테고리 조합입니다.\n상위 카테고리를 먼저 선택해주세요.`,
    action: "refresh",
  },
  "C400-3": {
    message: `올바르지 않은 카테고리 조합입니다.\n상위 카테고리를 먼저 선택해주세요.`,
    action: "refresh",
  },
};