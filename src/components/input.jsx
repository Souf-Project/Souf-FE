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
  value="", 
}) {
  const [inputValue, setInputValue] = useState(value);
  const [message, setMessage] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const isEmpty = inputValue.trim() === "";

  // 버튼 클릭 시 (검증 트리거)
  useEffect(() => {
    if (isValidateTrigger) {
      const valid = !isEmpty;
      setMessage(valid ? "" : essentialText);
      onValidChange(valid);
    }
  }, [isValidateTrigger, inputValue]);

  useEffect(() => {
    if (isConfirmed !== undefined) {
      if (isConfirmed === true) {
        if (!isEmpty) setMessage(approveText);
      } else if (isConfirmed === false) {
        if (!isEmpty) setMessage(disapproveText);
        else setMessage(essentialText);
      }
    }
  }, [isConfirmed, inputValue]);

  

  const handleFocus = () => {
    setIsEdited(true);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setHasInteracted(true);
    setIsEdited(true);

    const valid = value.trim() !== "";

    if (!valid) {
      setMessage(essentialText);
    } else {
      setMessage("");
    }

    onValidChange(valid);
    onChange(e);
  };

  const isApproved = isConfirmed === true && !isEmpty;
  const isDisapproved = isConfirmed === false && !isEmpty;
  const isError =
    (hasInteracted && isEmpty) ||
    (isValidateTrigger && isEmpty && !isApproved && !isDisapproved);

  const borderColor = isApproved
    ? "border-[#00aa58]"
    : isDisapproved || isError
    ? "border-red-essential"
    : "border-[#898989]";

  return (
    <div className="w-full relative mb-8">
      {title && (
        <div className="text-black text-lg md:text-2xl font-regular mb-2">{title}
         {subtitle !== "" && <span className="text-gray-500 text-xs sm:text-sm"> ({subtitle})</span>}</div>
      )}

      <input
        type={type}
        className={`w-full py-2 px-2 font-medium bg-[#F6F6F6] text-black placeholder-[#81818a] text-md md:text-lg border-0 border-b-[3px] outline-none transition-colors duration-200 ${borderColor} ${
          isError ? "" : "focus:border-yellow-point"
        }`}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
      />

      {message && (
        <p
          className={`absolute left-0 top-full mt-1 text-xs md:text-sm font-medium ${
            message === approveText ? "text-[#00AA58]" : "text-red-essential"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
