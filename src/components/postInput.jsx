export default function PostInput({ title, inputHeight = "h-16", value = "" }) {
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <div className="font-semibold text-lg">{title}</div>
      <textarea
        className={`border-2 p-2 rounded-[10px] w-full resize-none overflow-auto ${inputHeight}`}
        value={value}
      ></textarea>
    </div>
  );
}
