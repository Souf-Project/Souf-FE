export default function PostInput({
  title,
  inputHeight = "h-16",
  value = "",
  onChange,
}) {
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <div className="text-xl font-semibold text-gray-700">{title}</div>
      <textarea
        className={`border-2 p-2 rounded-[10px] w-full resize-none overflow-auto ${inputHeight}`}
        value={value}
        onChange={onChange}
      ></textarea>
    </div>
  );
}
