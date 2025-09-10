import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import backArrow from '../assets/images/backArrow.svg';
import AlertModal from '../components/alertModal';
import { postApplication } from '../api/application';
import { UserStore } from '../store/userStore';
import { closeRecruit, getRecruitDetail } from '../api/recruit';
import SEO from '../components/seo';
import { generateSeoContent } from '../utils/seo';
import { getAllCategoryNames, getCategoryNames } from '../utils/categoryUtils.js';
import DeclareButton from '../components/declare/declareButton'


const parsePayment = (paymentString) => {
  if (!paymentString || typeof paymentString !== 'string') return null;
  let numStr = paymentString.replace(/[^0-9.]/g, '');
  let num = parseFloat(numStr);
  if (paymentString.includes('만')) {
    num *= 10000;
  }
  return isNaN(num) ? null : num;
};

export default function RecruitDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const recruitData = location.state;
  const [recruitDetail, setRecruitDetail] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const { username, memberId } = UserStore();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplySuccessModalOpen, setIsApplySuccessModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isCloseSuccessModalOpen, setIsCloseSuccessModalOpen] = useState(false);
  const [isAlreadyClosedModalOpen, setIsAlreadyClosedModalOpen] = useState(false);
  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;


  useEffect(() => {
    // API에서 받은 상세 정보가 있으면 사용
    if (recruitData?.result) {
      setRecruitDetail(recruitData.result);
      console.log('Using API recruit detail:', recruitData.result);
    } else if (recruitData?.recruitDetail) {
      setRecruitDetail(recruitData.recruitDetail);
      console.log('Using API recruit detail:', recruitData.recruitDetail);
    }
  }, [recruitData]);


  //여기서  추가함 나중에 바꿔야해 
  useEffect(() => {
  const fetchRecruitDetail = async () => {
    try {
      const response = await getRecruitDetail(id);
      setRecruitDetail(response.data.result);
    } catch (error) {
      console.error('Error fetching recruit detail:', error);
      if (error.response?.status === 403) {
        alert("로그인이 필요합니다.");
        navigate('/login');
      }
    }
  };

  fetchRecruitDetail();
}, [id]);


  // 메뉴 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.relative')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // 닉네임 마스킹 함수
  const maskNickname = (nickname) => {
    if (!nickname || nickname.length <= 1) return nickname;
    return nickname.charAt(0) + '*'.repeat(nickname.length - 1);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // 메뉴 토글 함수
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // 수정 버튼 핸들러
  const handleEdit = () => {
    // 수정 모드로 recruitUpload 페이지로 이동
    navigate('/recruitUpload', { 
      state: { 
        isEditMode: true,
        recruitData: displayData,
        recruitDetail: recruitDetail
      } 
    });
    setShowMenu(false);
  };

  // 지원 마감 버튼 핸들러
  const handleDelete = (id) => {
    // 공고문 상태 확인
    const isRecruitable = recruitDetail?.recruitable ?? displayData?.recruitable ?? true;
    
    if (!isRecruitable) {
      // 이미 마감된 경우
      setIsAlreadyClosedModalOpen(true);
      setShowMenu(false);
    } else {
      // 마감 가능한 경우
      setIsCloseModalOpen(true);
      setShowMenu(false);
    }
  };

  const handleCloseRecruit = async () => {
    try {
      await closeRecruit(id, memberId);
      setIsCloseModalOpen(false);
      setIsCloseSuccessModalOpen(true);
    } catch (error) {
      console.error('지원 마감 실패:', error);
      alert('지원 마감 처리 중 오류가 발생했습니다.');
    }
  };

      

  const handleApply = () => {
    console.log('지원 버튼 클릭');
    setIsApplyModalOpen(true);
  };

  const handleViewApplicants = () => {
    console.log('지원자 리스트 보기 버튼 클릭');
    navigate(`/companyMyPage?recruitId=${id}`);
  };

  const handleApplyTrue = async () => {
    try {
      const response = await postApplication(id);
      console.log("지원 성공:", response.data);
      setIsApplyModalOpen(false);
      setIsApplySuccessModalOpen(true);
    } catch (error) {
      console.error("지원 실패:", error);
      if (error.response?.status === 403) {
        alert("학생 계정만 지원이 가능합니다.");
        navigate('/login');
      } else {
        alert("지원 중 오류가 발생했습니다.");
      }
      setIsApplyModalOpen(false);
    }
    setIsApplyModalOpen(false);
    setIsApplySuccessModalOpen(true);
  };

  const displayData = recruitDetail;
  const categoryList = recruitDetail?.categoryDtoList || [];
  const mobileCategoryNames = getCategoryNames(categoryList);
  const categoryNames = getAllCategoryNames(categoryList);
  const minPrice = parsePayment(recruitDetail?.minPayment);
  const maxPrice = parsePayment(recruitDetail?.maxPayment);
  const isAuthor = memberId === recruitDetail?.memberId;

  // 현재 로그인한 사용자가 공고 작성자인지 확인 (memberId로 비교)
  //const isAuthor = memberId === (recruitDetail?.memberId || displayData?.memberId);

  // 데이터가 없으면 로딩 상태 표시
  if (!displayData) {
    return (
      <div className="pt-16 px-8 w-5/6 mx-auto">
        <div className="text-center py-8">
          <p className="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const seoContent = generateSeoContent(
  {
    title: displayData?.title,
    nickname: displayData?.nickname,
    categoryNames,
    minPrice,
    maxPrice,
    deadline: displayData?.deadline,
    location: displayData?.location,
    recruitDetail,
    preferMajor: displayData?.preferMajor,
    content: displayData?.content,
  },
  {
    maskNickname,
    formatDate,
  }
);

  return (
    <>
      {displayData?.title && (
        <SEO
          title={displayData?.title}
          description={`스프 SouF ${displayData?.title} 기업 공고문`}
          subTitle="스프"
          content={seoContent}
        />
      )}
      <div className="w-full px-4 pt-12 sm:pt-16 sm:px-8 sm:w-5/6 mx-auto">
        <button 
          className="flex items-center text-gray-600 mb-4 hover:text-black transition-colors"
          onClick={handleGoBack}
        >
          <img src={backArrow} alt="뒤로가기" className="w-6 h-6 mr-2" />
          <span>목록으로 돌아가기</span>
        </button>

        <div className="bg-white rounded-2xl border border-gray p-5 sm:p-8 mb-8 mt-4">
          <div className="flex justify-between items-start">
            <div>{maskNickname(displayData?.nickname)}</div>
            {isAuthor ? (
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 10a2 2 0 110-4 2 2 0 010 4zM10 10a2 2 0 110-4 2 2 0 010 4zM17 10a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 rounded-b-lg"
                    >
                      지원 마감
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <DeclareButton 
                contentType="공고문" 
                iconClassName="w-5 h-5 cursor-pointer"
              />
            )}
          </div>
          <h1 className="text-xl sm:text-3xl font-semibold">{displayData?.title}</h1>
          <div className="border-t border-gray-200 my-4 sm:my-6">
          </div>
          <div className="hidden sm:flex flex-col text-gray-600 mb-6 mt-2">
            {categoryNames.map((category, index) => (
              <div key={index} className="mb-1">
                <span>{category.first}</span>
                {category.second && (
                  <>
                <span className="mx-2">&gt;</span>
                <span>{category.second}</span>
                  </>
                )}
                {category.third && (
                  <>
                <span className="mx-2">&gt;</span>
                <span className="font-medium text-black">{category.third}</span>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-2 sm:gap-8 my-4 sm:my-6 max-w-sm:text-sm ">
             <div className="sm:hidden flex items-center flex-wrap">
              <div className="flex flex-wrap gap-2">
                {mobileCategoryNames.map((name, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2 sm:space-y-4 ">
              <div>
                <span className="text-black mb-1">급여</span>
                <span className="text-gray-500 mx-2">|</span>
                <span className="font-medium">
                  {minPrice && maxPrice
                    ? `${minPrice.toLocaleString()}원 ~ ${maxPrice.toLocaleString()}원`
                    : '금액 협의'}
                </span>
              </div>
              <div>
                <span className="text-black mb-1">기한</span>
                <span className="text-gray-500 mx-2">|</span>
                <span className="font-medium">{formatDate(displayData?.deadline)}</span>
              </div>
              <div>
                <span className="text-black mb-1">지역</span>
                <span className="text-gray-500 mx-2">|</span>
                <span className="font-medium">{recruitDetail ? `${recruitDetail.cityName} ${recruitDetail.cityDetailName || ''}`.trim() : displayData?.location}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-black mb-1">우대사항</span>
                <span className="text-gray-500 mx-2">|</span>
                <span className="font-medium" style={{ whiteSpace: 'pre-wrap' }}>
                  {recruitDetail?.preferentialTreatment
                    ? recruitDetail.preferentialTreatment
                    : (displayData?.preferMajor ? '전공자 우대' : '경력/경험 무관')}
                </span>
              </div>
              
            </div>
          </div>

          <div className="border-t border-gray-200 my-4 sm:my-6"></div>
          <div>
            <p className="text-lg sm:text-2xl font-regular text-gray-800 mb-4"  style={{ whiteSpace: 'pre-wrap' }}>{displayData?.content}</p>
            
            {recruitDetail?.mediaResDtos && recruitDetail.mediaResDtos.length > 0 ? (
            <img
              src={`${S3_BUCKET_URL}${recruitDetail.mediaResDtos[0].fileUrl}`}
              alt={recruitDetail.mediaResDtos[0].fileName || "이미지"}
              className="w-full h-auto object-cover"
            />
          ) : (
            <></>
          )}
          </div>

        

        <div className="flex justify-center mt-8">
          {isAuthor ? (
            <></>
          ) : (
            <button 
              className="bg-yellow-main text-black w-1/2 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity"
              onClick={handleApply}
            >
              지원하기
            </button>
          )}
        </div>
        </div>
  {isApplyModalOpen && (
        <AlertModal
          type="warning"
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title="해당 기업에 지원하시겠습니까?"
          description={`지원 시 내 프로필 정보가 기업에게 전송됩니다.\n마이페이지에서 지원 취소가 가능합니다.\n지원 직후에는, 기업에게 지원 알림이 전송됩니다.`}
          FalseBtnText = "취소"
          TrueBtnText = "지원"
          onClickFalse={() => setIsApplyModalOpen(false)}
          onClickTrue={handleApplyTrue}
        />
      )}
      {isApplySuccessModalOpen && (
        <AlertModal
          type="success"
          isOpen={isApplySuccessModalOpen}
          onClose={() => setIsApplySuccessModalOpen(false)}
          title="지원 완료"
          description="지원이 완료되었습니다."
          TrueBtnText = "확인"
          onClickTrue={() => setIsApplySuccessModalOpen(false)}
        />
      )}
      {isCloseModalOpen && (
        <AlertModal
          type="warning"
          isOpen={isCloseModalOpen}
          onClose={() => setIsCloseModalOpen(false)}
          title="지원 마감"
          description="해당 공고문을 지원 마감 상태로 바꾸시겠습니까? "
          FalseBtnText = "취소"
          TrueBtnText = "지원 마감"
          onClickFalse={() => setIsCloseModalOpen(false)}
          onClickTrue={handleCloseRecruit}
        />
      )}
      {isCloseSuccessModalOpen && (
        <AlertModal
          type="success"
          isOpen={isCloseSuccessModalOpen}
          onClose={() => {
            setIsCloseSuccessModalOpen(false);
            navigate('/recruit?category=1');
          }}
          title="지원 마감 완료"
          description="지원 마감이 완료되었습니다."
          TrueBtnText="확인"
          onClickTrue={() => {
            setIsCloseSuccessModalOpen(false);
            navigate('/recruit?category=1');
          }}
        />
      )}
      {isAlreadyClosedModalOpen && (
        <AlertModal
          type="warning"
          isOpen={isAlreadyClosedModalOpen}
          onClose={() => setIsAlreadyClosedModalOpen(false)}
          title="이미 마감된 공고"
          description="이미 마감된 공고입니다."
          TrueBtnText="확인"
          onClickTrue={() => setIsAlreadyClosedModalOpen(false)}
        />
      )}

      </div>
    </>
  );
}