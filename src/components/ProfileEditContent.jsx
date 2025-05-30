import React, { useState } from 'react';
import EditBox from '../components/editBox';
import CategorySelectBox from './categorySelectBox';

export default function ProfileEditContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "김시은",
    nickname: "김시은",
    email: "Souf@gmail.com",
    password: "******",
    introduction: "안녕하세요 어쩌구저쩌구",
    website: "안녕하세요 어쩌구저쩌구",
    categories: ["", "", ""]
  });

  const handleChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (index) => (value) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => i === index ? value : cat)
    }));
  };

  const handleSave = () => {
    // TODO: API 호출하여 데이터 저장
    console.log('저장할 데이터:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // TODO: 원래 데이터로 복원
    setIsEditing(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center space-x-6 m-5">
          <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-400">사진</span>
          </div>
          <div>
            <div className="text-4xl font-bold mb-3">멋있는 개발자</div>
            <button 
              className="bg-white text-black border border-grey-border px-4 py-2 rounded-md"
              disabled={!isEditing}
            >
              프로필 사진 변경하기
            </button>
            <p className="text-sm text-gray-500 mt-2">800*800 크기의<br/>
            PNG, JPG 사진만 업로드 가능합니다.</p>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">개인 정보</h2>
          <div className="grid grid-cols-1 gap-6">
            <EditBox 
              title="이름" 
              value={formData.name}
              onChange={handleChange('name')}
              isEditing={isEditing}
            />
            <EditBox 
              title="닉네임" 
              value={formData.nickname}
              onChange={handleChange('nickname')}
              isEditing={isEditing}
            />
            <EditBox 
              title="이메일" 
              value={formData.email}
              onChange={handleChange('email')}
              isEditing={isEditing}
            />
            <EditBox 
              title="비밀번호" 
              value={formData.password}
              onChange={handleChange('password')}
              isEditing={isEditing}
            />
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">프로필 정보</h2>
          <div className="grid grid-cols-1 gap-6">
            <EditBox 
              title="자기소개" 
              value={formData.introduction}
              onChange={handleChange('introduction')}
              isEditing={isEditing}
            />
            <EditBox 
              title="개인 웹사이트 URL" 
              value={formData.website}
              onChange={handleChange('website')}
              isEditing={isEditing}
            />
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">관심분야</h2>
          <div className="grid grid-cols-3 gap-4">
            {formData.categories.map((category, index) => (
              <CategorySelectBox 
                key={index}
                title=""
                content=""
                defaultValue={category}
                type="text"
                isEditing={isEditing}
                onChange={handleCategoryChange(index)}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                className="w-40 py-3 bg-white text-gray-700 rounded-lg font-bold transition-colors border border-gray-300"
              >
                취소
              </button>
              <button 
                onClick={handleSave}
                className="w-40 py-3 bg-yellow-main text-black rounded-lg font-bold transition-colors"
              >
                수정완료
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="w-40 py-3 bg-yellow-main text-black rounded-lg font-bold transition-colors"
            >
              수정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};