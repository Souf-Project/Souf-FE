import React, { useState, useEffect } from 'react';
import EditBox from '../components/editBox';
import CategorySelectBox from './categorySelectBox';
import { getProfile, putProfileEdit } from '../api/mypage';

export default function ProfileEditContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    email: "",
    username: "",
    nickname: "",
    intro: "",
    personalUrl: "",
    role: "",
    newCategories: [
      {
        firstCategory: null,
        secondCategory: null,
        thirdCategory: null
      },
      {
        firstCategory: null,
        secondCategory: null,
        thirdCategory: null
      },
      {
        firstCategory: null,
        secondCategory: null,
        thirdCategory: null
      }
    ],
    profileImage: null
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await getProfile();
      if (response.status === 200 && response.data?.result) {
        setFormData(prev => ({
          ...prev,
          ...response.data.result
        }));
      } else {
        console.error('프로필 데이터 조회 실패:', response.data?.message);
      }
      
    } catch (error) {
      console.error('프로필 데이터 조회 중 에러 발생:', error);
      console.log(formData);
    }
  };

  const handleChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (index, field) => (value) => {
    setFormData(prev => ({
      ...prev,
      newCategories: prev.newCategories.map((cat, i) => 
        i === index ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const validateImageSize = (file) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const isValid = img.width <= 800 && img.height <= 800;
          if (!isValid) {
            alert('이미지 크기는 800x800px 이하여야 합니다.');
          }
          resolve(isValid);
        };
        img.onerror = () => {
          alert('이미지 파일을 읽을 수 없습니다.');
          resolve(false);
        };
        img.src = URL.createObjectURL(file);
      });
    };

    const isValid = await validateImageSize(file);
    if (isValid) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
    }
  };

  const handleSave = async () => {
    try {
      const requestData = {
        id: formData.id,
        username: formData.username,
        nickname: formData.nickname,
        intro: formData.intro,
        personalUrl: formData.personalUrl,
        newCategories: formData.newCategories.map(category => ({
          firstCategory: category.firstCategory || null ,
          secondCategory: category.secondCategory || null,
          thirdCategory: category.thirdCategory || null
        }))
      };

      const response = await putProfileEdit(requestData);
   
      if (response.status === 200) {
        alert("프로필이 성공적으로 수정되었습니다.");
        fetchProfileData(); 
        setIsEditing(false);
      } else {
        alert("프로필 수정에 실패했습니다: " + response?.data?.message);
      }
    } catch (error) {
      console.error("프로필 수정 중 에러 발생:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };
  
  
  const handleCancel = () => {
    fetchProfileData(); // 원래 데이터로 복원
    setIsEditing(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center space-x-6 m-5">
          <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {formData.profileImage ? (
              <img 
                src={URL.createObjectURL(formData.profileImage)} 
                alt="프로필" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">사진</span>
            )}
          </div>
          <div>
            <div className="text-4xl font-bold mb-3">{formData.username}</div>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={!isEditing}
            />
            <label 
              htmlFor="profileImage"
              className={`inline-block bg-white text-black border border-grey-border px-4 py-2 rounded-md cursor-pointer ${
                !isEditing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              프로필 사진 변경하기
            </label>
            <p className="text-sm text-gray-500 mt-2">
              800x800px 크기의<br/>
              PNG, JPG 사진만 업로드 가능합니다.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">개인 정보</h2>
          <div className="grid grid-cols-1 gap-6">
            <EditBox 
              title="이름" 
              value={formData.username}
              onChange={handleChange('username')}
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
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">프로필 정보</h2>
          <div className="grid grid-cols-1 gap-6">
            <EditBox 
              title="자기소개" 
              value={formData.intro}
              onChange={handleChange('intro')}
              isEditing={isEditing}
            />
            <EditBox 
              title="개인 웹사이트 URL" 
              value={formData.personalUrl}
              onChange={handleChange('personalUrl')}
              isEditing={isEditing}
            />
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">관심분야</h2>
          <div className="grid grid-cols-3 gap-4">
            {formData.newCategories.map((category, index) => (
              <CategorySelectBox 
                key={index}
                title=""
                content=""
                defaultValue={category}
                type="text"
                isEditing={isEditing}
                onChange={(field) => (value) => handleCategoryChange(index, field)(value)}
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