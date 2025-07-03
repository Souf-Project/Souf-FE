import React, { useRef, useState } from "react";

export default function ImageUpload({ onImagesChange }) {
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 10;
  const MAX_VIDEO = 1;
  const MAX_TOTAL_SIZE = 700 * 1024 * 1024; // 700MB in bytes

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));

    // 개수 초과 검사
    if (images.length + imageFiles.length > MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}개까지 업로드할 수 있습니다.`);
      return;
    }

    if (videoFiles.length > 0 && video) {
      alert("동영상은 1개만 업로드할 수 있습니다.");
      return;
    }

    // 용량 검사
    const totalSize =
      images.reduce((acc, img) => acc + img.file.size, 0) +
      (video?.file?.size || 0) +
      files.reduce((acc, f) => acc + f.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      alert("총 첨부 용량은 700MB를 초과할 수 없습니다.");
      return;
    }

    // 이미지 처리
    const newImages = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);

    // 동영상 처리 (하나만)
    if (videoFiles.length > 0) {
      const videoFile = videoFiles[0];
      setVideo({
        file: videoFile,
        preview: URL.createObjectURL(videoFile),
      });
    }

    // 부모에 전달
    const allFiles = [...updatedImages.map((img) => img.file)];
    if (videoFiles.length > 0) {
      allFiles.push(videoFiles[0]);
    } else if (video) {
      allFiles.push(video.file);
    }
    onImagesChange(allFiles);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">파일 첨부</h3>
      <div className="flex gap-4 flex-wrap">
        {/* 이미지 미리보기 */}
        {images.map((img, index) => (
          <img
            key={index}
            src={img.preview}
            className="w-32 h-32 object-cover rounded"
            alt={`img-${index}`}
          />
        ))}

        {/* 동영상 미리보기 */}
        {video && (
          <video
            src={video.preview}
            controls
            className="w-32 h-32 rounded object-cover"
          />
        )}

        {/* 업로드 버튼 */}
        <div
          onClick={handleClick}
          className="w-32 h-32 border flex justify-center items-center text-2xl text-gray-400 cursor-pointer"
        >
          +
        </div>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
    </div>
  );
}
