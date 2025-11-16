import Input from "../components/input";

export default function Button({
  title,
  type,
  btnText,
  onClick,
  disabled = false,
  width = "w-full",
  isLoading = false,
}) {
  return (
    <button
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`h-[52px] px-6 mt-2 whitespace-nowrap rounded-[10px] text-white text-xl font-semibold bg-blue-main  ${width}
      ${
        disabled || isLoading
          ? "opacity-75 cursor-not-allowed"
          : "shadow-md"
      }`}
    >
      {isLoading ? "처리 중..." : btnText}
    </button>
  );
}
