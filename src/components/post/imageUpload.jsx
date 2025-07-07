import { useEffect, useRef, useState } from "react";

export default function ImageUpload({ onImagesChange, initialImages = [] }) {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialImages.length !== 0) {
      const formatted = initialImages.map((img) => {
        const extMatch = img.fileName?.match(/\.(\w+)$/);
        const ext = extMatch ? extMatch[1].toUpperCase() : "JPG";
        return {
          file: img,
          preview: `https://iamsouf-bucket.s3.ap-northeast-2.amazonaws.com/${img.fileUrl}`,
        };
      });
      setImages(formatted);
      notifyParent(formatted);
    }
  }, [initialImages]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages.map((img) => img.file));
    //notifyParent(updatedImages);
  };

  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    notifyParent(updatedImages);
  };

  const notifyParent = (imageList) => {
    onImagesChange(
      imageList.map((img) => ({
        file: img.file,
      }))
    );
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">사진 첨부</h3>
      <div className="flex gap-4 flex-wrap">
        {images.map((img, index) => (
          <div className="relative">
            <div className="absolute top-1 right-1 bg-white bg-opacity-70 cursor-pointer text-xl px-[5px]" onClick={() => handleImageDelete(index)} >x</div>
          <img
            key={index}
            src={img.preview}
            alt={img.fileName || `업로드된 이미지 ${index + 1}`}
            className="w-32 h-32 object-cover rounded "
          />
          </div>
        ))}
        <div
          onClick={handleClick}
          className="w-32 h-32 border flex justify-center items-center text-2xl text-gray-400 cursor-pointer"
        >
          +
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
    </div>
  );
}
