import Input from "../components/input";

export default function Button({
  title,
  type,
  btnText,
  onClick,
  disabled = false,
  width = "w-full",
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`h-[52px] px-6 mt-2 whitespace-nowrap rounded-[10px] text-white text-xl font-semibold bg-blue-main  ${width}
      ${
        disabled
          ? "opacity-75 cursor-not-allowed"
          : "shadow-md"
      }`}
    >
      {btnText}
    </button>
  );
}
