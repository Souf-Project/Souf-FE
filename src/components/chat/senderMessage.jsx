export default function SenderMessage({ content, createdTime, isPending = false, type = "TALK", onImageClick, onFileClick }) {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

  return (
    <div className="flex items-end justify-end gap-2 mb-4">
        <span className="text-xs text-gray-500 block text-right mt-1">
          {isPending ? getCurrentTime() : formatTime(createdTime)}
        </span>
      <div className="max-w-xs bg-yellow-main text-gray-800 px-4 py-2 rounded-lg rounded-br-none shadow">
        {type === "IMAGE" ? (
          <img 
            src={S3_BUCKET_URL + content} 
            alt="채팅 이미지" 
            className="max-w-full h-auto rounded cursor-pointer transition-opacity"
            onClick={() => onImageClick && onImageClick(S3_BUCKET_URL + content)}
            onError={(e) => {
              console.error("이미지 로드 실패:", content);
              e.target.style.display = 'none';
            }}
          />
        ) : type === "VIDEO" ? (
          <video 
            src={content.startsWith('http') ? content : S3_BUCKET_URL + content} 
            controls
            className="max-w-full h-auto rounded"
            onError={(e) => {
              console.error("동영상 로드 실패:", content);
              e.target.style.display = 'none';
            }}
          >
            <source src={content.startsWith('http') ? content : S3_BUCKET_URL + content} type="video/mp4" />
            브라우저가 동영상을 지원하지 않습니다.
          </video>
        ) : type === "FILE" ? (
          <div 
            className="flex items-center gap-2 p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => onFileClick && onFileClick(S3_BUCKET_URL + content)}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm text-gray-700 truncate">{content.split('/').pop()}</span>
          </div>
        ) : (
        <p className="text-sm">{content}</p>
        )}
      </div>
    </div>
  );
}
