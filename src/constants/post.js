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
