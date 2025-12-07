import React, { useRef, useState, useEffect } from 'react';
import basiclogoimg from '../../assets/images/basiclogoimg.png';

export default function ProfileImageUpdate({
  isEditing,
  initialImageUrl,
  nickname,
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
      // 파일 형식 검증
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        alert('PNG, JPG, JPEG 형식만 업로드 가능합니다.');
        e.target.value = ''; // 파일 입력 초기화
        return;
      }
      
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
    <div className="flex space-x-6">
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
          <img src={basiclogoimg} alt="basiclogoimg" className="w-full h-full object-cover border-2 border-gray-300 rounded-full" />
         
        )}
        {isEditing && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-lg font-bold">
              변경
            </div>
        )}
      </div>
      <div className="flex flex-col mt-4">
        <input
          type="file"
          id="profileImage"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={!isEditing}
        />
        <h1 className="text-4xl font-bold ">{nickname}</h1>
        <p className="text-sm text-gray-500 mt-2">
          PNG, JPG, JPEG 형식만 업로드 가능합니다.<br/>
          (최대 800x800px)
        </p>
      </div>
    </div>
  );
}
