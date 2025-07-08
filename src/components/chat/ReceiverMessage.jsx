export default function ReceiverMessage({ content, createdTime, opponentProfileImageUrl, type = "TALK" }) {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

  return (
    <div className="flex items-start gap-2 mb-4">
      <img src={opponentProfileImageUrl} className="w-10 h-10 rounded-full" />
      <div className="flex gap-2 items-end">
        <div className="max-w-xs bg-gray-200 text-black px-4 py-2 rounded-lg rounded-bl-none shadow">
          {type === "IMAGE" ? (
            <img 
              src={S3_BUCKET_URL + content} 
              alt="채팅 이미지" 
              className="max-w-full h-auto rounded"
              onError={(e) => {
                console.error("이미지 로드 실패:", content);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <p className="text-sm">{content}</p>
          )}
        </div>
        <span className="text-xs text-gray-500 block text-right mt-1">{formatTime(createdTime)}</span>
      </div>
    </div>
  );
}
