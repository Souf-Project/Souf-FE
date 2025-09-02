import React, { useState, useEffect } from 'react';
import EditBox from '../components/editBox';
import CategorySelectBox from './categorySelectBox';
import { getProfile, updateProfileInfo, uploadToS3, confirmImageUpload, getNickNameVerify } from '../api/mypage';
import { useMutation } from '@tanstack/react-query';
import ProfileImageUpdate from './post/profileImageUpdate';
import { UserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import noneCheckBox from "../assets/images/noneCheckBox.png";
import fillCheckBox from "../assets/images/fillCheckBox.png";
import Loading from './loading';
import kakaoLogo from "../assets/images/kakaoLogo.png"
import googleLogo from "../assets/images/googleLogo.png"

export default function ProfileEditContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nicknameVerified, setNicknameVerified] = useState(false);
  const [verifyingNickname, setVerifyingNickname] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [marketingAgreement, setMarketingAgreement] = useState(false);
  const {roleType} = UserStore();
  
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();
  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

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
        const profileData = response.data.result;
        console.log(profileData);
        
        // 백엔드에서 받은 categoryDtoList를 newCategories 형식으로 변환
        let newCategories = [
          { firstCategory: null, secondCategory: null, thirdCategory: null },
          { firstCategory: null, secondCategory: null, thirdCategory: null },
          { firstCategory: null, secondCategory: null, thirdCategory: null }
        ];
        
        if (profileData.categoryDtoList && Array.isArray(profileData.categoryDtoList)) {
          profileData.categoryDtoList.forEach((category, index) => {
            if (index < 3) { // 최대 3개까지만 처리
              newCategories[index] = {
                firstCategory: category.firstCategory,
                secondCategory: category.secondCategory,
                thirdCategory: category.thirdCategory
              };
            }
          });
        }
        
        setFormData({
          ...profileData,
          newCategories: newCategories,
          originalNickname: profileData.nickname, // 원본 닉네임 저장
          marketingAgreement: profileData.marketingAgreement || false // 마케팅 동의 여부 추가
        });
        setMarketingAgreement(profileData.marketingAgreement || false); // 마케팅 동의 상태 초기화

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
      // 기존 이미지 URL에서 파일명 추출
      const getFileNameFromUrl = (url) => {
        if (!url) return null;
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1];
      };

      const updatePayload = {
        username: dataToSave.username,
        nickname: dataToSave.nickname,
        intro: dataToSave.intro,
        personalUrl: dataToSave.personalUrl,
        newCategories: dataToSave.newCategories,
        profileOriginalFileName: selectedFile ? selectedFile.name : null,
        marketingAgreement: marketingAgreement, // 마케팅 동의 여부 추가
      };

      // 이미지를 수정하지 않을 때만 profileImageUrl 추가
      if (!selectedFile && formData.profileImageUrl) {
        updatePayload.profileImageUrl = formData.profileImageUrl;
      }
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
          fileName: [selectedFile.name],
          fileType: [selectedFile.type.split('/')[1].toLowerCase()] // ✅ JS 배열
        });
        
      }
      
      return updateResponse;
    },
    onSuccess: () => {
      alert("프로필이 성공적으로 수정되었습니다.");
      setIsEditing(false);
      setSelectedFile(null);
      setNicknameVerified(false);
      setVerificationMessage('');
      fetchProfileData(); // 수정 성공 후 데이터를 다시 불러옵니다.
    },
    onError: (error) => {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다.");
    }
  });

  const handleSave = () => {
    // 닉네임이 변경되었는데 중복확인이 되지 않은 경우
    if (formData.nickname !== formData.originalNickname && !nicknameVerified) {
      alert('닉네임 중복확인을 완료해주세요.');
      return;
    }

    // 1차 카테고리만 선택되어도 유효한 항목으로 간주하여 필터링
    const selectedCategories = formData.newCategories?.filter(cat => cat && cat.firstCategory !== null) || [];
    
    // 필터링된 유효한 카테고리가 하나 이상인지 확인
    if (selectedCategories.length === 0) {
      alert('최소 1개 이상의 관심분야를 선택해주세요.');
      return;
    }
    
    // 선택되지 않은 2차, 3차 카테고리는 null로 처리하여 전송
    const finalCategories = selectedCategories.map(cat => {
      const category = {
        firstCategory: cat.firstCategory,
        secondCategory: cat.secondCategory || null,
        thirdCategory: cat.thirdCategory || null
      };
      return category;
    });
    

    profileUpdateMutation.mutate({ ...formData, newCategories: finalCategories });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setNicknameVerified(false);
    setVerificationMessage('');
    setMarketingAgreement(formData?.marketingAgreement || false); // 마케팅 동의 상태를 원래대로 되돌림
  };
  
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 닉네임이 변경되면 검증 상태 초기화
    if (field === 'nickname') {
      setNicknameVerified(false);
      setVerificationMessage('');
    }
  };

  const handleCategoryChange = (index) => (categoryData) => {
    setFormData(prev => {
      const updatedCategories = [...(prev.newCategories || [])];
      updatedCategories[index] = categoryData;
      return { ...prev, newCategories: updatedCategories };
    });
  };

  // 닉네임 중복확인 함수
  const handleNicknameVerify = async () => {
    if (!formData.nickname || formData.nickname.trim() === '') {
      setVerificationMessage('닉네임을 입력해주세요.');
      return;
    }

    setVerifyingNickname(true);
    try {
      const response = await getNickNameVerify(formData.nickname);
      if (response.data?.result === true) {
        setVerificationMessage('✓ 중복확인 완료');
        setNicknameVerified(true);
      } else {
        setVerificationMessage('이미 사용 중인 닉네임입니다.');
        setNicknameVerified(false);
      }
    } catch (error) {
      console.error('닉네임 중복확인 중 에러:', error);
      setVerificationMessage('닉네임 중복확인에 실패했습니다.');
      setNicknameVerified(false);
    } finally {
      setVerifyingNickname(false);
    }
  };

  if (loading) {
    return <Loading text="프로필 정보를 불러오는 중..." />;
  }

  if (!formData) {
    return <div className="text-center py-10">프로필 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 relative">
       
        <ProfileImageUpdate
            isEditing={isEditing}
            initialImageUrl={formData.profileImageUrl ? `${formData.profileImageUrl}` : null}
            onFileSelect={handleFileSelect}
        />
         <div className="absolute top-[40px] left-[225px]">
            <h1 className="text-4xl font-bold ">{formData.nickname}</h1>
        </div>
        
            <div className="flex items-center justify-between gap-4 w-full">
            {isEditing ? <></> : <button onClick={() => setIsEditing(true)} className="w-40 py-4 bg-yellow-main text-black rounded-xl font-bold transition-colors">수정하기</button>}
           
             
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
            <div>
            <div className="flex items-end w-full">
            <EditBox 
              title="닉네임" 
              value={formData.nickname}
              onChange={handleChange('nickname')}
              isEditing={isEditing}
            />
              <div className="m-4">
                <div className="flex items-center gap-2 justify-end w-full">
                  <button
                    type="button"
                    onClick={handleNicknameVerify}
                    disabled={!isEditing || verifyingNickname || !formData.nickname || formData.nickname === formData.originalNickname}
                    className={`px-6 py-5 rounded-md font-bold transition-colors mt-10 ${
                      !isEditing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : verifyingNickname || !formData.nickname || formData.nickname === formData.originalNickname
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-yellow-point text-white'
                    }`}
                  >
                    {verifyingNickname ? '확인 중...' : '중복확인'}
                  </button>
                </div>
              </div>
              </div>
              <span className="text-sm text-left ml-4">{verificationMessage}</span>
            </div>
           
            <EditBox 
              title="이메일" 
              value={formData.email}
              isEditing={false}
            />
          </div>
        </div>
        {roleType === "STUDENT" &&
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
        </div> }
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">관심분야</h2>
          <div className="grid grid-cols-3 gap-4 ">
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
        <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">SNS 계정 연동</h2>
        <div className="flex items-center justify-center gap-4">
            <button 
                className="w-60 bg-[#FEE500] rounded-xl p-4 shadow-sm hover:shadow-md duration-200 flex items-center justify-center gap-4"
              >

                <img src={kakaoLogo} alt="카카오 로그인" className="w-[1.4rem] object-contain" />
                <p>카카오 계정으로 연동</p>
              </button>
              <button 
                className="w-60 bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md duration-200 flex items-center justify-center gap-7"
              >
                <img src={googleLogo} alt="구글 로그인" className="w-[1.4rem] object-contain" />
                구글 계정으로 연동
              </button>
            </div>
            </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">마케팅 수신 동의</h2>
          <button
                type="button"
                onClick={() => isEditing && setMarketingAgreement(!marketingAgreement)}
                disabled={!isEditing}
                className={`flex items-center gap-3 ${
                  !isEditing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
              >
                <img 
                  src={marketingAgreement ? fillCheckBox : noneCheckBox} 
                  alt="마케팅 수신 동의" 
                  className="w-5 h-5"
                />
                <span className="text-lg">
                  마케팅 수신 동의 여부
                </span>
              </button>
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
           <></>
          )}
      </div>
      
      <div className='flex justify-between items-center'>
     
      
           
          <button
            className="text-gray-400 underline"
            onClick={() => navigate("/withdraw")}
          >
            회원탈퇴
          </button>
          </div>
          
    </div>
    </div>
  );
}