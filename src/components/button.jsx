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
      className={`h-[52px] px-6 mt-2 whitespace-nowrap rounded-[10px] text-black text-xl font-semibold bg-yellow-main  ${width}
      ${
        disabled
          ? "opacity-75 cursor-not-allowed"
          : "hover:bg-yellow-point transition-colors duration-200"
      }`}
    >
      {btnText}
    </button>
  );
}
