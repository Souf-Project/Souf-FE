import React, { useState, useEffect } from 'react';
import EditBox from '../components/editBox';
import CategorySelectBox from './categorySelectBox';
import { getProfile, updateProfileInfo, uploadToS3, confirmImageUpload } from '../api/mypage';
import { useMutation } from '@tanstack/react-query';
import ProfileImageUpdate from './post/profileImageUpdate';

export default function ProfileEditContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState(null);

  const S3_BUCKET_URL = "https://iamsouf-bucket.s3.ap-northeast-2.amazonaws.com/";

  useEffect(() => {
    if (!isEditing) {
      fetchProfileData();
    }
  }, [isEditing]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await getProfile();
      if (response.status === 200 && response.data?.result) {
        setFormData(response.data.result);
      } else {
        console.error('프로필 데이터 조회 실패:', response.data?.message);
        setFormData(null);
      }
    } catch (error) {
      console.error('프로필 데이터 조회 중 에러 발생:', error);
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const profileUpdateMutation = useMutation({
    mutationFn: async (dataToSave) => {
      // 1. 프로필 텍스트 정보와 새 파일명 전송
      const updatePayload = {
        username: dataToSave.username,
        nickname: dataToSave.nickname,
        intro: dataToSave.intro,
        personalUrl: dataToSave.personalUrl,
        newCategories: dataToSave.newCategories,
        profileOriginalFileName: selectedFile ? selectedFile.name : null,
      };

      const updateResponse = await updateProfileInfo(updatePayload);

      // 2. 새 파일이 있고, 서버가 Presigned URL을 반환한 경우
      if (selectedFile && updateResponse.result?.dtoList?.presignedUrl) {
        const { memberId, dtoList } = updateResponse.result;
        const { presignedUrl, fileUrl } = dtoList;

        // 2a. S3에 파일 업로드
        await uploadToS3(presignedUrl, selectedFile);

        // 2b. S3 업로드 완료 후, 서버에 최종 정보 전송
        await confirmImageUpload({
          postId: memberId,
          fileUrl: `${S3_BUCKET_URL}${fileUrl}`,
          fileName: [selectedFile.name], // ✅ JS 배열
          fileType: [selectedFile.type.split('/')[1].toLowerCase()] // ✅ JS 배열
        });
        
      }
      
      return updateResponse;
    },
    onSuccess: () => {
      alert("프로필이 성공적으로 수정되었습니다.");
      setIsEditing(false);
      setSelectedFile(null);
      fetchProfileData(); // 수정 성공 후 데이터를 다시 불러옵니다.
    },
    onError: (error) => {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다.");
    }
  });

  const handleSave = () => {
    // 1차 카테고리만 선택되어도 유효한 항목으로 간주하여 필터링
    const selectedCategories = formData.newCategories?.filter(cat => cat && cat.firstCategory !== null) || [];
    
    // 필터링된 유효한 카테고리가 하나 이상인지 확인
    if (selectedCategories.length === 0) {
      alert('최소 1개 이상의 관심분야를 선택해주세요.');
      return;
    }
    
    // 선택되지 않은 2차, 3차 카테고리는 null로 처리하여 전송
    const finalCategories = selectedCategories.map(cat => ({
        firstCategory: cat.firstCategory,
        secondCategory: cat.secondCategory || null,
        thirdCategory: cat.thirdCategory || null,
    }));

    profileUpdateMutation.mutate({ ...formData, newCategories: finalCategories });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
  };
  
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };
  
  const handleChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (index) => (categoryData) => {
    setFormData(prev => {
      const updatedCategories = [...(prev.newCategories || [])];
      updatedCategories[index] = categoryData;
      return { ...prev, newCategories: updatedCategories };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-point"></div>
      </div>
    );
  }

  if (!formData) {
    return <div className="text-center py-10">프로필 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 relative">
       
        <ProfileImageUpdate
            isEditing={isEditing}
            initialImageUrl={formData.profileUrl ? `${formData.profileUrl}` : null}
            onFileSelect={handleFileSelect}
        />
         <div className="absolute top-[40px] left-[225px]">
            <h1 className="text-4xl font-bold ">{formData.username}</h1>
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
              isEditing={false}
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
            {[0, 1, 2].map(index => (
              <CategorySelectBox 
                key={index}
                defaultValue={formData.newCategories?.[index] || { firstCategory: null, secondCategory: null, thirdCategory: null }}
                isEditing={isEditing}
                onChange={handleCategoryChange(index)}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          {isEditing ? (
            <>
              <button onClick={handleCancel} disabled={profileUpdateMutation.isPending} className="w-40 py-3 bg-white text-gray-700 rounded-lg font-bold transition-colors border border-gray-300">취소</button>
              <button onClick={handleSave} disabled={profileUpdateMutation.isPending} className="w-40 py-3 bg-yellow-main text-black rounded-lg font-bold transition-colors">
                {profileUpdateMutation.isPending ? '저장 중...' : '수정완료'}
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="w-40 py-3 bg-yellow-main text-black rounded-lg font-bold transition-colors">수정하기</button>
          )}
        </div>
      </div>
    </div>
  );
}