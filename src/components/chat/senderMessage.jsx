export default function SenderMessage({ content }) {
  return (
    <div className="flex justify-end mb-2">
      <div className="max-w-xs bg-yellow-main text-gray-900 px-4 py-2 rounded-lg rounded-br-none shadow">
        <p className="text-sm">{content}</p>
        <span className="text-xs text-white/80 block text-right mt-1"></span>
      </div>
    </div>
  );
}
