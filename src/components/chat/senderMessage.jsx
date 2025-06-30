export default function SenderMessage({ content, isPending = false }) {
  return (
    <div className="flex justify-end mb-2">
      <div className={`max-w-xs px-4 py-2 rounded-lg rounded-br-none shadow ${
        isPending ? 'bg-gray-300 text-gray-600' : 'bg-yellow-main text-gray-900'
      }`}>
        <p className="text-sm">{content}</p>
        <span className="text-xs bg-yellow-main text-gray-900 block text-right mt-1">
          {isPending && "전송 중..."}
        </span>
      </div>
    </div>
  );
}
