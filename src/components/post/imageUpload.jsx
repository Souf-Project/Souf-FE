import React, { useRef, useState } from "react";

export default function ImageUpload() {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">사진 첨부</h3>
      <div className="flex gap-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.preview}
            className="w-32 h-32 object-cover rounded"
          />
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
