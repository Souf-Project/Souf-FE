export const handlePublicApiError = (error, setters, errorDictionary) => {
  const {
    setErrorModal,
    setErrorDescription,
    setErrorAction,
  } = setters;

  const errorKey = error?.response?.data?.errorKey;
  const errorInfo = errorDictionary[errorKey];

  setErrorDescription(errorInfo?.message || "알 수 없는 오류가 발생했습니다.");
  setErrorAction(errorInfo?.action || "redirect");
  setErrorModal(true);
};