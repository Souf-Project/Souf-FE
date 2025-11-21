// /{roomId}/orderer/preview (GET) - 발주자 정보 조회 API 에러
export const CONTRACT_ORDERER_PREVIEW_ERRORS = {
  "M404-1": {
    message: "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "reload",
  },
  "CH404-2": {
    message: "채팅방을 찾을 수 없습니다. 채팅 목록으로 돌아가 다시 시도해주세요.",
    action: "reload",
  },
};

// /{roomId}/orderer (POST) - 계약서 작성 API 에러
export const CONTRACT_ORDERER_ERRORS = {
  "M404-1": {
    message: "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "",
  },
  "CO403-1": {
    message: "계약서 작성 권한이 없습니다. 로그인 상태를 확인해주세요.",
    action: "",
  },
  "CH404-2": {
    message: "채팅방을 찾을 수 없습니다. 채팅 목록으로 돌아가 다시 시도해주세요.",
    action: "",
  },
  "CO403-2": {
    message: "계약서를 작성할 권한이 없습니다. 올바른 채팅방에서 시도해주세요.",
    action: "",
  },
};

// /{roomId}/beneficiary/preview (GET) - 수급자 정보 조회 API 에러
export const CONTRACT_BENEFICIARY_PREVIEW_ERRORS = {
  "M404-1": {
    message: "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "reload",
  },
  "CO410-2": {
    message: "이미 완료된 요청입니다.",
    action: "reload",
  },
  "CO409-2": {
    message: "취소된 계약서 요청입니다.",
    action: "reload",
  },
  "CO410-1": {
    message: "시간이 만료되었습니다. 다시 시도해주세요.",
    action: "reload",
  },
  "CO403-2": {
    message: "계약서를 작성할 권한이 없습니다. 올바른 채팅방에서 시도해주세요.",
    action: "reload",
  },
  "CO403-1": {
    message: "계약서 작성 권한이 없습니다.",
    action: "reload",
  },
};

// /{roomId}/beneficiary/preview/contract (PATCH) - 수급자 계약서 조회 API 에러
export const CONTRACT_BENEFICIARY_PREVIEW_CONTRACT_ERRORS = {
  "M404-1": {
    message: "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "",
  },
  "CO410-2": {
    message: "이미 작성된 계약서입니다.",
    action: "reload",
  },
  "CO409-2": {
    message: "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "",
  },
  "CO410-1": {
    message: "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "",
  },
  "CO403-2": {
    message: "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "",
  },
  "CO403-1": {
    message: "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "",
  },
  "CO404-1": {
    message: "계약서를 찾을 수 없습니다. 계약서를 다시 작성해주세요.",
    action: "",
  },
  "CO404-2": {
    message: "계약서를 찾을 수 없습니다. 계약서를 다시 작성해주세요.",
    action: "",
  },
};

// /{roomId}/beneficiary (POST) - 수급자 계약서 생성 API 에러
export const CONTRACT_BENEFICIARY_ERRORS = {
  "M404-1": {
    message: "계약 당사자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "reload",
  },
  "CO410-2": {
    message: "계약서 작성 시간이 만료되었습니다. 계약서 생성을 다시 요청해주세요.",
    action: "reload",
  },
  "CO409-2": {
    message: "계약 당사자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "reload",
  },
  "CO410-1": {
    message: "계약 당사자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "reload",
  },
  "CO403-2": {
    message: "계약 당사자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "reload",
  },
  "CO403-1": {
    message: "계약 당사자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "reload",
  },
  "CO404-1": {
    message: "계약서를 찾을 수 없습니다. 계약서를 다시 작성해주세요.",
    action: "reload",
  },
  "CO403-3": {
    message: "계약번호가 일치하지 않아 계약서에 접근할 수 없습니다. 올바른 계약서를 확인해주세요.",
    action: "reload",
  },
  "CO409-1": {
    message: "이미 서명이 완료된 계약서입니다.",
    action: "reload",
  },
};

// /{roomId} (GET) - 계약서 PDF 조회 API 에러
export const CONTRACT_VIEW_ERRORS = {
  "M404-1": {
    message: "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "reload",
  },
  "CH404-2": {
    message: "채팅방을 찾을 수 없습니다. 채팅 목록으로 돌아가 다시 시도해주세요.",
    action: "reload",
  },
  "CO404-1": {
    message: "계약서를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "reload",
  },
  "FI404-1": {
    message: "계약서 파일을 찾을 수 없습니다. 다시 시도해주세요.",
    action: "reload",
  },
};

// /{roomId}/orderer/upload (POST) - 계약서 업로드 API 에러
export const CONTRACT_ORDERER_UPLOAD_ERRORS = {
  "M404-1": {
    message: "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
    action: "reload",
  },
  "CH404-2": {
    message: "채팅방을 찾을 수 없습니다. 채팅 목록으로 돌아가 다시 시도해주세요.",
    action: "reload",
  },
  "CO404-1": {
    message: "계약서를 찾을 수 없습니다. 계약서를 다시 작성해주세요.",
    action: "reload",
  },
  "CO409-1": {
    message: "이미 서명이 완료된 계약서입니다. 다른 계약서를 작성해주세요.",
    action: "reload",
  },
  "FI404-1": {
    message: "계약서 파일을 찾을 수 없습니다. 파일을 다시 업로드해주세요.",
    action: "reload",
  },
};
