import { useEffect } from "react";
import Input from "../components/input";

export default function ButtonInput({
  title,
  type,
  btnText,
  onClick,
  placeholder,
  onChange,
  subtitle = "",
  disapproveText = "",
  essentialText = "",
  approveText = "",
  onValidChange = () => {},
  isValidateTrigger = false,
  isConfirmed = undefined,
  value = "",
  isLoading = false,
  disabled = false,
  btnDisabled = false,
}) {
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="w-full flex gap-3 items-center">
        <div className="flex-1">
          <Input
            title={title}
            isValidateTrigger={isValidateTrigger}
            isConfirmed={isConfirmed}
            placeholder={placeholder}
            onChange={onChange}
            essentialText={essentialText}
            approveText={approveText}
            disapproveText={disapproveText}
            onValidChange={onValidChange}
            value={value}
            subtitle={subtitle}
            disabled={disabled}
          />
        </div>
        
        {btnText && (
          <button
            onClick={onClick}
            disabled={isLoading || btnDisabled}
            className={`h-[48px] md:h-[52px] px-6 whitespace-nowrap rounded-[10px] text-white text-lg md:text-xl font-semibold bg-blue-main ${
              isLoading || btnDisabled
                ? "opacity-75 cursor-not-allowed"
                : "bg-blue-main hover:shadow-md transition-colors duration-200"
            }`}
          >
            {isLoading ? "전송 중..." : btnText}
          </button>
        )}
      </div>
    </div>
  );
}
