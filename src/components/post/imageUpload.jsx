import { useEffect, useRef, useState } from "react";

export default function ImageUpload({ onImagesChange, initialImages = [] }) {
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 10;
  const MAX_VIDEO_SIZE = 700 * 1024 * 1024; // 700MB

  const VIDEO_EXTENSIONS = ["mp4", "mov", "avi", "webm", "mkv"];

  useEffect(() => {
    if (initialImages.length !== 0) {
      const imageList = [];
      let videoFile = null;

      initialImages.forEach((img) => {
        const fileUrl = img.fileUrl || "";
        const extMatch = fileUrl.match(/\.(\w+)$/);
        const ext = extMatch ? extMatch[1].toLowerCase() : "";

        const preview = `https://iamsouf-bucket.s3.ap-northeast-2.amazonaws.com/${fileUrl}`;
        const wrappedFile = {
          file: img,
          preview,
        };

        if (VIDEO_EXTENSIONS.includes(ext)) {
          videoFile = wrappedFile;
        } else {
          imageList.push(wrappedFile);
        }
      });

      setImages(imageList);
      setVideo(videoFile);

      const fileList = [...imageList.map((img) => img.file)];
      if (videoFile) fileList.push(videoFile.file);
      onImagesChange(fileList);
    }
  }, [initialImages]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));

    if (images.length + imageFiles.length > MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}개까지 업로드할 수 있습니다.`);
      return;
    }

    if (videoFiles.length > 0) {
      if (video) {
        alert("동영상은 1개만 업로드할 수 있습니다.");
        return;
      }

      if (videoFiles[0].size > MAX_VIDEO_SIZE) {
        alert("동영상은 700MB 이하만 업로드할 수 있습니다.");
        return;
      }
    }

    const newImages = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);

    if (videoFiles.length > 0) {
      const videoFile = videoFiles[0];
      setVideo({
        file: videoFile,
        preview: URL.createObjectURL(videoFile),
      });
    }

    const allFiles = [...updatedImages.map((img) => img.file)];
    if (videoFiles.length > 0) {
      allFiles.push(videoFiles[0]);
    } else if (video) {
      allFiles.push(video.file);
    }

    onImagesChange(allFiles);
  };

  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    const fileList = [...updatedImages.map((img) => img.file)];
    if (video) fileList.push(video.file);
    onImagesChange(fileList);
  };

  const handleVideoDelete = () => {
    setVideo(null);
    onImagesChange([...images.map((img) => img.file)]);
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
          <div className="relative" key={index}>
            <div
              className="absolute top-1 right-1 bg-white bg-opacity-70 cursor-pointer text-xl px-[5px]"
              onClick={() => handleImageDelete(index)}
            >
              x
            </div>
            <img
              src={img.preview}
              alt={img.fileName || `업로드된 이미지 ${index + 1}`}
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        ))}

{video && (
  <div className="relative w-32 h-32">
    <div
      className="absolute top-1 right-1 z-10 bg-white bg-opacity-70 cursor-pointer text-xl px-[5px]"
      onClick={handleVideoDelete}
    >
      x
    </div>
    <video
      src={video.preview}
      controls
      className="w-full h-full rounded object-cover z-0"
    />
  </div>
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