import React, { useRef, useState, useEffect } from 'react';

export default function ProfileImageUpdate({
  isEditing,
  initialImageUrl,
  onFileSelect,
}) {
  const [preview, setPreview] = useState(initialImageUrl);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(initialImageUrl);
  }, [initialImageUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex items-center space-x-6 m-5">
      <div 
        className={`w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative ${isEditing ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="프로필"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">사진</span>
        )}
        {isEditing && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-lg font-bold">
              변경
            </div>
        )}
      </div>
      <div>
        <input
          type="file"
          id="profileImage"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={!isEditing}
        />
        <p className="text-sm text-gray-500 mt-2">
          PNG, JPG 형식만 업로드 가능합니다.<br/>
          (최대 800x800px)
        </p>
      </div>
    </div>
  );
}
