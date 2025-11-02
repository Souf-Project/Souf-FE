import { useState, useEffect } from "react";

export default function Input({
  title,
  placeholder = "",
  type,
  onChange = () => {},
  essentialText,
  approveText,
  disapproveText,
  onValidChange = () => {},
  isValidateTrigger = false,
  isConfirmed = undefined,
  subtitle = "",
  value = "",
  disabled = false,
  width = "w-full",
}) {
  const [inputValue, setInputValue] = useState(value);
  const [hasInteracted, setHasInteracted] = useState(false);

  // 외부에서 전달된 value prop이 변경될 때, 내부 inputValue 상태 업데이트
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    onValidChange(inputValue.trim() !== "");
  }, [inputValue, onValidChange]);

  const handleChange = (e) => {
    const currentValue = e.target.value;
    setInputValue(currentValue);
    setHasInteracted(true);
    onChange(e); // 부모 컴포넌트로 onChange 이벤트
  };

  const isEmpty = inputValue.trim() === "";
  let validationType = "neutral"; // 'neutral', 'success', 'error' 세 가지 상태로 관리
  let displayMessage = "";

  if (isConfirmed === false) {
    validationType = "error";
    // 필드가 비어있다면 '필수' 메시지를, 아니라면 '불일치' 메시지
    displayMessage = !isEmpty ? disapproveText : essentialText;
  } else if (isConfirmed === true && !isEmpty) {
    validationType = "success";
    displayMessage = approveText;
  } else if ((hasInteracted || isValidateTrigger) && isEmpty) {
    validationType = "error";
    displayMessage = essentialText;
  }

  const borderColor = {
    neutral: "border-[#898989]",
    success: "border-[#00aa58]",
    error: "border-red-essential",
  }[validationType];

  const textColor = {
    success: "text-[#00AA58]",
    error: "text-red-essential",
  }[validationType];

  return (
    <div className="w-full relative mb-8">
      {title && (
        <div className="text-black text-lg md:text-xl font-regular mb-2">
          {title}
          {subtitle !== "" && (
            <span className="text-gray-500 text-xs sm:text-sm">
              {" "}
              ({subtitle})
            </span>
          )}
        </div>
      )}

      <input
        type={type}
        className={`${width} py-2 px-2 font-medium text-black placeholder-[#81818a] text-md border-0 border-b-[3px] outline-none transition-colors duration-200 border-[#898989] ${
          disabled 
            ? "bg-gray-200 cursor-not-allowed" 
            : `bg-[#F6F6F6] ${validationType !== "error" ? "focus:border-blue-main" : ""}`
        }`}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setHasInteracted(true)}
        disabled={disabled}
      />

      {displayMessage && (
        <p
          className={`absolute left-0 top-full mt-1 text-xs font-medium ${textColor}`}
        >
          {displayMessage}
        </p>
      )}
    </div>
  );
}
