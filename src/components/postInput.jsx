export default function PostInput({
  title,
  inputHeight = "h-16",
  value = "",
  onChange,
  maxLength="",
}) {
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <div className="flex items-center">
        <div className="font-semibold text-lg">{title}</div>
        <span className="text-xs text-gray-500">&nbsp;{maxLength !== "" && `( ${value.length} / ${maxLength} )`}</span>
      </div>
      <textarea
        className={`border border-grey-border p-2 rounded-md w-full resize-none overflow-auto ${inputHeight}`}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      ></textarea>
    </div>
  );
}
