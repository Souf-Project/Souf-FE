//handleApiError(err, { setShowLoginModal, setErrorModal, setErrorDescription, setErrorAction },MEMBER_ERRORS);
export const handleApiError = (error, setters, errorDictionary) => {
  const {
    setShowLoginModal,
    setErrorModal,
    setErrorDescription,
    setErrorAction,
  } = setters;

  const status = error?.response?.status;
  const errorKey = error?.response?.data?.errorKey;

  if (status === 403) {
    setShowLoginModal(true);
    return;
  }

  const errorInfo = errorDictionary[errorKey];
  setErrorDescription(errorInfo?.message || "알 수 없는 오류가 발생했습니다.");
  setErrorAction(errorInfo?.action || "redirect");
  setErrorModal(true);
};


