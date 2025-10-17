// 댓글 관련 에러 정의
export const COMMENT_ERRORS = {
  "M404-1": {
    message: `댓글 작성이 불가능한 상태입니다.\n잠시 후 다시 시도해주세요.`,
    action: "redirect",
  },
  "F404-1": {
    message: "존재하지 않는 피드입니다.",
    action: "redirect",
  },
  "CM404-1": {
    message: "존재하지 않는 댓글입니다.",
    action: "refresh",
  },
  "CM404-2": {
    message: "해당 댓글에 접근 권한이 없습니다.",
    action: "refresh"
  },
};

// 피드 업로드 관련 에러 정의
// 얘네는 그냥 홈으로? 아님 피드리스트
export const FEED_UPLOAD_ERRORS = {
  "M404-1": {
    message: "올바르지 않은 계정입니다\n이메일 정보를 확인해주세요.",
    action: "redirect", //메인 피드 홈?
  },
  "C404-1": {
    message: "올바르지 않은 대분류 카테고리가 포함되어 있습니다.",
    action: null, 
  },
  "C404-2": {
    message: "올바르지 않은 중분류 카테고리가 포함되어 있습니다.",
    action: null,
  },
  "C404-3": {
    message: "올바르지 않은 소분류 카테고리가 포함되어 있습니다.",
    action: null,
  },
  "C400-1": {
    message: `올바르지 않은 카테고리 조합입니다.\n상위 카테고리를 먼저 선택해주세요.`,
    action: null, 
  },
  "C400-2": {
    message: `올바르지 않은 카테고리 조합입니다.\n상위 카테고리를 먼저 선택해주세요.`,
    action: null,
  },
  "C400-3": {
    message: `올바르지 않은 카테고리 조합입니다.\n상위 카테고리를 먼저 선택해주세요.`,
    action: null,
  },
  "F404-1": {
    message: "존재하지 않는 피드에 대한 접근입니다.",
    action: "redirect",
  },
};

export const FEED_ERRORS = {
  "M404-1": {
    message: "올바르지 않은 계정입니다\n이메일 정보를 확인해주세요.",
    action: "login", 
  },
  "F404-1": {
    message: "존재하지 않는 피드에 대한 접근입니다.",
    action: "redirect",
  },
  "F403-1": {
    message: "해당 피드에 접근 권한이 없습니다.",
    action: "redirect",
  },
  "F400-1": {
    message: "이미 좋아요를 눌렀습니다.",
    action: null,
  },
  "F404-2": {
    message: "좋아요가 반영되지 않았습니다.",
    action: null,
  },
}

