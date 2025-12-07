import React, { useState, useEffect } from 'react';
import EditBox from '../editBox';
import CategorySelectBox from '../categorySelectBox';
import { getProfile, updateProfileInfo, uploadToS3, confirmImageUpload, getNickNameVerify } from '../../api/mypage';
import { useMutation } from '@tanstack/react-query';
import ProfileImageUpdate from '../post/profileImageUpdate';
import { UserStore } from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import checkBoxIcon from '../../assets/images/checkBoxIcon.svg';
import notCheckBoxIcon from '../../assets/images/notCheckBoxIcon.svg';
import Loading from '../loading';
import kakaoLogo from "../../assets/images/kakaoLogo.png"
import googleLogo from "../../assets/images/googleLogo.png"
import { handleApiError } from '../../utils/apiErrorHandler';
import { MEMBER_ERRORS } from '../../constants/user';
import AlertModal from '../alertModal';

export default function ProfileEditContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nicknameVerified, setNicknameVerified] = useState(false);
  const [verifyingNickname, setVerifyingNickname] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [marketingAgreement, setMarketingAgreement] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("잘못된 접근");
  const [errorAction, setErrorAction] = useState("redirect");
  const [showLoginModal, setShowLoginModal] = useState(false);
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
        // console.log(profileData);
        
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
          originalNickname: profileData.nickname,
          marketingAgreement: profileData.marketingAgreement || false
        });
        setMarketingAgreement(profileData.marketingAgreement || false);

      } else {
        console.error('프로필 데이터 조회 실패:', response.data?.message);
        setFormData(null);
      }
    } catch (error) {
      console.error('프로필 데이터 조회 중 에러 발생:', error);
      setFormData(null);
      handleApiError(error, { setShowLoginModal, setErrorModal, setErrorDescription, setErrorAction },MEMBER_ERRORS);
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

      console.log("📤 [프로필 수정] 시작");
      console.log("📤 [프로필 수정] selectedFile:", selectedFile ? {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      } : null);
      
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

      let updateResponse;
      try {
        updateResponse = await updateProfileInfo(updatePayload);
      } catch (error) {
        console.error("❌ [프로필 수정] API 호출 실패:", error);
        console.error("❌ [프로필 수정] 에러 상세:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          payload: updatePayload
        });
        throw error; 
      }
  

      // 2. 새 파일이 있고, 서버가 Presigned URL을 반환한 경우
      // dtoList 또는 presignedUrlResDto 확인
      const result = updateResponse.result;
      const dtoList = result?.dtoList;
      const presignedUrlResDto = result?.presignedUrlResDto;
      
      // presignedUrl과 fileUrl 추출
      let presignedUrl = null;
      let fileUrl = null;
      let memberId = result?.memberId;
      
      if (dtoList?.presignedUrl) {
        presignedUrl = dtoList.presignedUrl;
        fileUrl = dtoList.fileUrl;
      } else if (presignedUrlResDto?.presignedUrl) {
        presignedUrl = presignedUrlResDto.presignedUrl;
        fileUrl = presignedUrlResDto.fileUrl;
      } else if (dtoList && typeof dtoList === 'object' && dtoList.presignedUrl) {
        presignedUrl = dtoList.presignedUrl;
        fileUrl = dtoList.fileUrl;
      }
      
      
      if (selectedFile && presignedUrl) {

        // 2. S3에 파일 업로드
        await uploadToS3(presignedUrl, selectedFile);

        await confirmImageUpload({
          postId: memberId,
          fileUrl: `${S3_BUCKET_URL}${fileUrl}`,
          fileName: [selectedFile.name],
          fileType: [selectedFile.type.split('/')[1].toLowerCase()],
        });
        
      } else {
        console.warn("[프로필 수정] 파일 업로드 조건 불만족:", {
          hasSelectedFile: !!selectedFile,
          hasPresignedUrl: !!presignedUrl
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
      fetchProfileData();
    },
    onError: (error) => {
      console.error("프로필 수정 실패:", error);
      handleApiError(error, { setShowLoginModal, setErrorModal, setErrorDescription, setErrorAction },MEMBER_ERRORS);
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

    // 카카오 로그인
    const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile_nickname,account_email,profile_image`;
    
    // 카카오 연동
    const handleKakaoLogin = () => {
      if (!isEditing) return;
      
      localStorage.setItem('socialProvider', 'KAKAO');
      localStorage.setItem('isLinking', 'true'); // 연동 모드
      window.location.href = KAKAO_AUTH_URL;
    }
  
    // 구글 연동
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;
    
    const handleGoogleLogin = () => {
      if (!isEditing) return;
      
      localStorage.setItem('socialProvider', 'GOOGLE');
      localStorage.setItem('isLinking', 'true'); // 연동 모드
      window.location.href = GOOGLE_AUTH_URL;
    }

    
  if (loading) {
    return <Loading text="프로필 정보를 불러오는 중..." />;
  }

  if (!formData) {
    return <>
<div className="text-center py-10">프로필 정보를 불러오지 못했습니다.</div>
    {showLoginModal && (
      <AlertModal
          type="simple"
          title="로그인이 필요합니다"
          description="로그인 후 마이페이지를 조회할 수 있습니다!"
          TrueBtnText="로그인하러 가기"
          FalseBtnText="취소"
          onClickTrue={() => {
            setShowLoginModal(false);
            navigate("/login");
          }}
          onClickFalse={() => setShowLoginModal(false)}
          />
        )}
        {errorModal && (
          <AlertModal
          type="simple"
          title="잘못된 접근"
          description={errorDescription}
          TrueBtnText="확인"
          onClickTrue={() => {
            if (errorAction === "redirect") {
                navigate("/login");
            }else if(errorAction === "refresh"){
              setErrorModal(false);
            }else{
              setErrorModal(false);
              //window.location.reload();
            }
          }}
            />
        )}</>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 relative">
            <div className="flex items-center justify-between gap-4 w-full pr-8 m-5">
            <ProfileImageUpdate
            isEditing={isEditing}
            initialImageUrl={formData.profileImageUrl ? `${formData.profileImageUrl}` : null}
            onFileSelect={handleFileSelect}
            nickname={formData.nickname}
        />
        
            {isEditing ? <></> : <button onClick={() => setIsEditing(true)} className="px-6 py-4 bg-blue-main text-white rounded-xl font-bold transition-colors mb-auto">수정하기</button>}

            </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">개인 정보</h2>
          <div className="grid grid-cols-1 gap-2">
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
                 <button
                    type="button"
                    onClick={handleNicknameVerify}
                    disabled={!isEditing || verifyingNickname || !formData.nickname || formData.nickname === formData.originalNickname}
                    className={`p-4 rounded-md font-bold text-lg transition-colors mt-10 ml-2 ${
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
              <span className="text-sm text-left ml-4">{verificationMessage}</span>
            </div>
           
            <EditBox 
              title="이메일" 
              value={formData.email}
              isEditing={false}
            />
            <EditBox 
              title="휴대폰 번호" 
              value={formData.phoneNumber}
              isEditing={false}
              margin="mt-4"
            />
           
          </div>
        </div>
       
          {roleType === "MEMBER" && formData.detail && (
             <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">사업자 정보</h2>
            <div>
            <div className="grid grid-cols-2 gap-4">
              <EditBox 
              title="회사명" 
              value={formData.detail.companyName}
              isEditing={false}
            />
             <EditBox 
              title="사업자 구분" 
              value={formData.detail.businessClassification}
              isEditing={false}
            />
             <EditBox 
              title="사업자 번호" 
              value={formData.detail.businessRegistrationNumber}
              isEditing={false}
            />
             <EditBox 
              title="업태" 
              value={formData.detail.businessStatus}
              isEditing={false}
            />
            <div className="col-span-2">
              <label className="block text-black font-semibold text-xl mb-2">주소</label>
              <div className="flex flex-col gap-3">
                {/* 우편번호 */}
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <div className="bg-[#F7F7F7] px-4 py-4 border-r border-gray-300 text-gray-600 font-semibold min-w-[120px]">
                    우편번호
                  </div>
                  <div className="flex-1 p-4 pl-7 bg-[#F7F7F7] text-gray-600">
                    {formData.detail?.addressReqDto?.zipCode || formData.detail?.zipCode || '-'}
                  </div>
                </div>
                {/* 도로명 주소 */}
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <div className="bg-[#F7F7F7] px-4 py-4 border-r border-gray-300 text-gray-600 font-semibold min-w-[120px]">
                    도로명 주소
                  </div>
                  <div className="flex-1 p-4 pl-7 bg-[#F7F7F7] text-gray-600">
                    {formData.detail?.addressReqDto?.roadNameAddress || formData.detail?.roadNameAddress || '-'} {formData.detail?.addressReqDto?.detailedAddress || formData.detail?.detailedAddress || '-'}
                  </div>
                </div>
                
              </div>
            </div>
             </div>
            </div>
            </div>
          )}

        {roleType === "STUDENT" &&
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">프로필 정보</h2>
          <div className="grid grid-cols-1 gap-4">
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
        {roleType === "STUDENT" && formData.detail && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">대학생 인증 정보</h2>
            <div className="grid grid-cols-1 gap-4">
              <EditBox 
                title={formData.detail.educationType === "GRADUATE" ? "대학원명" : "대학교명"} 
                value={formData.detail.schoolName}
                isEditing={isEditing}
              />
              <EditBox 
                title="전공" 
                value={formData.detail.specialties && formData.detail.specialties.length > 0 
                  ? formData.detail.specialties.map(s => s.specialtyName).join(', ')
                  : '-'}
                isEditing={isEditing}
              />
              <EditBox 
                title="학교 이메일" 
                value={formData.detail.schoolEmail}
                isEditing={isEditing}
              />
            </div>
          </div>
        )}
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
                disabled={!isEditing}
                className={`w-60 rounded-xl p-4 shadow-sm duration-200 flex items-center justify-center gap-4 ${
                  isEditing 
                    ? 'bg-[#FEE500] hover:shadow-md cursor-pointer' 
                    : 'bg-yellow-300 cursor-not-allowed opacity-60'
                }`}
                onClick={handleKakaoLogin}
              >
                <img src={kakaoLogo} alt="카카오 로그인" className="w-[1.4rem] object-contain" />
                <p>카카오 계정으로 연동</p>
              </button>
              <button 
                disabled={!isEditing}
                className={`w-60 rounded-xl p-4 shadow-sm duration-200 flex items-center justify-center gap-7 ${
                  isEditing 
                    ? 'bg-white border-2 border-gray-200 hover:shadow-md cursor-pointer' 
                    : 'bg-gray-100 border-2 border-gray-300 cursor-not-allowed opacity-60'
                }`}
                onClick={handleGoogleLogin}
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
                  src={marketingAgreement ? checkBoxIcon : notCheckBoxIcon} 
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
                <button onClick={handleSave} disabled={profileUpdateMutation.isPending} className="w-40 py-3 bg-blue-main text-black rounded-lg font-bold transition-colors">
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