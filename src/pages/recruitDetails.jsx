import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import backArrow from '../assets/images/backArrow.svg';
import AlertModal from '../components/alertModal';
import { postApplication } from '../api/application';
import { UserStore } from '../store/userStore';
import { closeRecruit, getRecruitDetail } from '../api/recruit';
import SEO from '../components/seo';
import { generateSeoContent } from '../utils/seo';
import DeclareButton from '../components/declare/declareButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PageHeader from "../components/pageHeader";
import { getAllCategoryNames, getCategoryNames } from '../utils/categoryUtils.js';
import RecommendRecruit from "../components/recruit/recommendRecruit";
import { handleApiError } from '../utils/apiErrorHandler.js';
import { APPLICATION_ERRORS } from '../constants/application.js';

import EstimateBanner from "../components/home/EstimateBanner";

const formatPayment = (paymentString) => {
  if (!paymentString || typeof paymentString !== 'string') return '견적 희망';
  return paymentString;
};

export default function RecruitDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const recruitData = location.state;
  const [recruitDetail, setRecruitDetail] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const { username, memberId, approvedStatus, roleType } = UserStore();
  const [modal, setModal] = useState(null);
  const [isCloseSuccessModalOpen, setIsCloseSuccessModalOpen] = useState(false);
  const [isAlreadyClosedModalOpen, setIsAlreadyClosedModalOpen] = useState(false);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [priceOffer, setPriceOffer] = useState('');
  const [priceReason, setPriceReason] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("잘못된 접근입니다.");
  const [errorAction, setErrorAction] = useState(null);
  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;


  useEffect(() => {
    // API에서 받은 상세 정보가 있으면 사용
    if (recruitData?.result) {
      setRecruitDetail(recruitData.result);
      // console.log('Using API recruit detail:', recruitData.result);
    } else if (recruitData?.recruitDetail) {
      setRecruitDetail(recruitData.recruitDetail);
      // console.log('Using API recruit detail:', recruitData.recruitDetail);
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
      setModal({
        type: 'warning',
        title: '지원 마감',
        description: '해당 공고문을 지원 마감 상태로 바꾸시겠습니까? ',
        FalseBtnText: '취소',
        TrueBtnText: '지원 마감',
        onClickFalse: () => setModal(null),
        onClickTrue: handleCloseRecruit,
      });
      setShowMenu(false);
    }
  };

  const handleCloseRecruit = async () => {
    try {
      await closeRecruit(id, memberId);
      setModal(null);
      setIsCloseSuccessModalOpen(true);
    } catch (error) {
      console.error('지원 마감 실패:', error);
      alert('지원 마감 처리 중 오류가 발생했습니다.');
    }
  };

      

  const handleApply = () => {
    // console.log('지원 버튼 클릭');
    
    // 학생 계정인지 확인
    if (roleType !== "STUDENT") {
      setModal({
        type: 'simple',
        title: '지원 불가',
        description: '학생 계정만 지원 기능을 이용할 수 있습니다.',
        TrueBtnText: '확인',
        onClickTrue: () => setModal(null),
      });
      return;
    }
    
    if (approvedStatus === "PENDING") {
      setErrorDescription("승인 대기 중인 유저는\n지원할 수 없습니다.");
      setErrorAction("redirect");
      setErrorModal(true);
      return;
    }
    if (!displayData?.price || displayData.price === '견적 희망') {
      setIsEstimateModalOpen(true);
    } else {
      setModal({
        type: 'warning',
        title: '해당 기업에 지원하시겠습니까?',
        description: '지원 시 내 프로필 정보가 기업에게 전송됩니다.\n마이페이지에서 지원 취소가 가능합니다.\n지원 직후에는, 기업에게 지원 알림이 전송됩니다.',
        FalseBtnText: '취소',
        TrueBtnText: '지원',
        onClickFalse: () => setModal(null),
        onClickTrue: handleApplyTrue,
      });
    }
  };

  const handleViewApplicants = () => {
    // console.log('지원자 리스트 보기 버튼 클릭');
    navigate(`/companyMyPage?recruitId=${id}`);
  };

  const handleApplyTrue = async () => {
    try {
      const response = await postApplication(id, {
       priceOffer: priceOffer,
       priceReason: priceReason,
      });
      // console.log("지원 성공:", response.data);
      setModal(null);
      setModal({
        type: 'success',
        title: '지원 완료',
        description: '지원이 완료되었습니다.',
        TrueBtnText: '확인',
        onClickTrue: () => setModal(null),
      });
    } catch (error) {
      console.error("지원 실패:", error);
      // if (error.response?.status === 403) {
      //   alert("학생 계정만 지원이 가능합니다.");
      //   navigate('/login');
      // } else {
      //   alert("지원 중 오류가 발생했습니다.");
      // }
      // setIsApplyModalOpen(false);
      handleApiError(error,{setShowLoginModal,setErrorModal,setErrorDescription,setErrorAction},APPLICATION_ERRORS);
    }
    //setIsApplyModalOpen(false);

    //setIsApplySuccessModalOpen(true);
  };

  const handleEstimateSubmit = async () => {
    if (!priceOffer.trim() || !priceReason.trim()) {
      alert("견적 금액과 사유를 모두 입력해주세요.");
      return;
    }

    const numericValue = priceOffer.replace(/[^0-9]/g, '');
    const priceOfferWithUnit = numericValue + '만원';

    try {
      const response = await postApplication(id, {
        priceOffer: priceOfferWithUnit,
        priceReason: priceReason,
      });
      // console.log("견적 제출 성공:", response.data);
      setIsEstimateModalOpen(false);
      setModal({
        type: 'success',
        title: '지원 완료',
        description: '지원이 완료되었습니다.',
        TrueBtnText: '확인',
        onClickTrue: () => setModal(null),
      });

      setPriceOffer('');
      setPriceReason('');
    } catch (error) {
      console.error("견적 제출 실패:", error);
      handleApiError(error,{setShowLoginModal,setErrorModal,setErrorDescription,setErrorAction},APPLICATION_ERRORS);
      // if (error.response?.status === 403) {
      //   alert("학생 계정만 지원이 가능합니다.");
      //   navigate('/login');
      // } else {
      //   alert("견적 제출 중 오류가 발생했습니다.");
      // }
      setIsEstimateModalOpen(false);
    }
  };

  const displayData = recruitDetail;
  const categoryList = recruitDetail?.categoryDtoList || [];
  const mobileCategoryNames = getCategoryNames(categoryList);
  const categoryNames = getAllCategoryNames(categoryList);
  const price = formatPayment(recruitDetail?.price);
  const isAuthor = memberId === recruitDetail?.memberId;

  // 현재 로그인한 사용자가 공고 작성자인지 확인 (memberId로 비교)
  //const isAuthor = memberId === (recruitDetail?.memberId || displayData?.memberId);

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
    price,
    startDate: displayData?.startDate,
    deadline: displayData?.deadline,
    location: displayData?.location,
    recruitDetail,
    preferMajor: displayData?.preferMajor,
    content: displayData?.content,
  },
  {
    nickname: displayData?.nickname,
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
      <PageHeader
        leftButtons={[
          { text: `외주 찾기 > 외주 상세 조회`, onClick: () => {} }
        ]}
        showDropdown={false}
        showSearchBar={false}
      />
     
      
      <div className="flex w-full mx-auto max-w-[60rem] pb-40 gap-12 px-8 lg:px-0">
        <div className="w-2/3 mx-auto pt-4">
        <button 
          className="flex items-center text-gray-600 mb-4 hover:text-black transition-colors"
          onClick={handleGoBack}
        >
          <img src={backArrow} alt="뒤로가기" className="w-6 h-6 mr-2" />
          <span>목록으로 돌아가기</span>
        </button>

          <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{displayData?.title}</h1>
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
              postType="RECRUIT"
              postId={id}
              title={displayData?.title || recruitDetail?.title || "공고문"}
              reporterId={memberId}
              reportedMemberId={recruitDetail?.memberId}
              iconClassName="w-5 h-5 cursor-pointer"
            />
            )}
          </div>
          <div className="flex items-center gap-2">
         {displayData.logoUrl? 
             <img 
               src={`${S3_BUCKET_URL}${displayData.logoUrl}`} 
               alt="logo" 
               className="w-8 h-8 object-cover rounded-full shadow-sm border-2 border-gray-200"
             /> 
             : <></>}
              <div className="text-md font-bold my-2">{displayData?.hostName}</div>
         </div>
         
          <div className="flex items-center">
          {categoryNames.map((category, index) => (
       
        <div key={index} className="flex items-center">
          {category.third ? (
            <span className="font-medium text-neutral-500 text-md">{category.third}</span>
          ) : category.second ? (
            <span className="font-medium text-neutral-500 text-md">{category.second}</span>
          ) : (
            <span className="font-medium text-neutral-500 text-md">{category.first}</span>
          )}
          {index < categoryNames.length - 1 && (
            <span className="font-medium text-neutral-500 text-md mx-1">/</span>
          )}
        </div>
      ))}
          </div>
         

          <div className="border-t border-gray-200 my-4 sm:my-6"></div>
          <div className="flex flex-col gap-8 border-b border-gray-200 pb-8">
            <div>
            <p className="text-xl font-semibold text-black mb-4">
               기업 소개
             </p>
             <p>
              {displayData?.introduction}
             </p>
            </div>

            {/* <div>
            <p className="text-xl font-semibold text-black mb-4">
               외주 간략 소개
             </p>
             <p>
              {displayData?.introduction}
             </p>
            </div> */}

            
            <div>
              <p className="text-xl font-semibold text-black mb-4">
               요청사항
             </p>
             <div className="prose prose-lg max-w-none text-gray-800 mb-4 text-sm whitespace-pre-wrap">
               <ReactMarkdown 
                 remarkPlugins={[remarkGfm]}
                 rehypePlugins={[rehypeRaw]}
                 components={{
                   u: ({children}) => <u>{children}</u>,
                   strong: ({children}) => <strong>{children}</strong>,
                   em: ({children}) => <em>{children}</em>,
                   p: ({children}) => <p className="mb-4">{children}</p>,
                   br: () => <br />,
                   a: ({href, children}) => (
                     <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                       {children}
                     </a>
                   ),
                   img: ({src, alt}) => (
                     <img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-2" />
                   )
                 }}
               >
                 {displayData?.content || ''}
               </ReactMarkdown>
             </div>
             </div>
            
            {recruitDetail?.mediaResDtos && recruitDetail.mediaResDtos.length > 0 ? (
              <div className="space-y-4">
                {recruitDetail.mediaResDtos.map((media, index) => (
                  <img
                    key={index}
                    src={`${S3_BUCKET_URL}${media.fileUrl}`}
                    alt={media.fileName || `이미지 ${index + 1}`}
                    className="w-full h-auto object-cover rounded-lg shadow-sm"
                  />
                ))}
              </div>
            ) : (
              <></>
            )}

            <div>
              <p className="text-xl font-semibold text-black mb-4">
               우대사항
             </p>
             <p>
              {displayData?.preferentialTreatment}
             </p>
            </div>

            <div>
              <p className="text-xl font-semibold text-black mb-4">
               근무 형태
             </p>
             <p>
              {displayData?.workType === 'OFFLINE' ? '오프라인' : 
               displayData?.workType === 'ONLINE' ? '온라인' : 
               displayData?.workType}
             </p>
            </div>

            {displayData?.workType === 'OFFLINE' && (
              <div>
                <p className="text-xl font-semibold text-black mb-4">
                 근무 장소
               </p>
               <p>
                {displayData?.cityName} {displayData?.cityDetailName}
               </p>
              </div>
            )}

          </div>
          <p className="text-sm text-neutral-500 my-4">서비스 상품 교환 및 환불 규정 등은 결제·정산·환불(에스크로) 정책을 참고해주세요.</p>
          {/* <RecommendRecruit /> */}
          <EstimateBanner color="blue" />

        </div>
        {/* 우측 외주 조건 */}
        <div className="sticky top-24 w-1/3 bg-[#FCFCFC] mt-10 p-6 h-fit rounded-lg shadow-md text-sm">
            <div className="space-y-8 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 mb-1">견적 비용</span>
                <span className="font-lg">
                  {price
                    ? `${price.toLocaleString()}`
                    : '견적 희망'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-600 mb-1 whitespace-nowrap">마감일</span>
                <div className="flex flex-col items-center gap-2 text-right">
                <span className="font-lg">{formatDate(displayData?.startDate)}</span>
                <span className="font-lg">~{formatDate(displayData?.deadline)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 mb-1">지역</span>
                <span className="font-lg">{displayData?.cityName} {displayData?.cityDetailName}</span>

              </div>
              {displayData?.preferentialTreatmentTags && displayData?.preferentialTreatmentTags.length > 0 ? (
          <div className="flex items-center justify-between">
            <span className="text-neutral-600 mb-1 whitespace-nowrap">우대사항 키워드</span>
              <div className="flex items-center">
                {displayData?.preferentialTreatmentTags[0] && <div className="font-lg">{displayData?.preferentialTreatmentTags[0]}</div>}
                {displayData?.preferentialTreatmentTags[1] && <div className="font-lg">, {displayData?.preferentialTreatmentTags[1]}</div>}
             </div>
          </div>
) : (
  <></>
)}
            </div>
            {isAuthor ? (
            <></>
          ) : (
            <div className="flex justify-between gap-4 mt-6 mb-4">
              <button className="bg-zinc-800 text-white w-1/2 py-2 rounded-lg text-base font-bold"
              onClick={() =>alert("문의하기 기능은 준비 중입니다.")}>문의하기</button>
              {recruitDetail?.recruitable ? (
                <button 
                  onClick={handleApply}
                  className="bg-blue-600 text-white w-1/2 py-2 rounded-lg text-base font-bold"
                >
                  {(!displayData?.price || displayData.price === '견적 희망') ? '견적 보내기' : '지원하기'}
                </button>
              ) : (
                <button className="bg-gray-400 text-black w-1/2 py-2 rounded-lg text-base font-bold cursor-not-allowed" disabled>지원 마감</button>
              )}
            </div>
          )}
          <span className="text-zinc-500">이 외주를 총 <span className="text-black font-bold">{displayData?.totalViewCount}</span>명이 조회하였습니다.</span>
          </div>
      {modal && (
        <AlertModal
          type={modal.type}
          title={modal.title}
          description={modal.description}
          FalseBtnText={modal.FalseBtnText}
          TrueBtnText={modal.TrueBtnText}
          onClickFalse={modal.onClickFalse}
          onClickTrue={modal.onClickTrue}
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
      {isEstimateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4 text-center">견적 보내기</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견적 금액
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={priceOffer}
                    onChange={(e) => {
                      // 숫자만 입력 허용
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setPriceOffer(value);
                    }}
                    placeholder="예: 50"
                    className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span>만원</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견적 사유
                </label>
                <textarea
                  value={priceReason}
                  onChange={(e) => setPriceReason(e.target.value)}
                  placeholder="예: 리서치/시안 2안 포함"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEstimateModalOpen(false);
                  setPriceOffer('');
                  setPriceReason('');
                }}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg font-semibold hover:shadow-md"
              >
                취소
              </button>
              <button
                onClick={handleEstimateSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:shadow-md"
              >
                견적 보내기
              </button>
            </div>
          </div>
        </div>
      )}
      {showLoginModal && (
       <AlertModal
       type="simple"
       title="로그인이 필요합니다"
       description="SouF 학생 회원만 공고문에 지원가능합니다."
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
            title="지원 오류"
            description={errorDescription}
            TrueBtnText="확인"
            onClickTrue={() => {
              setErrorModal(false);
              if (errorAction === "redirect") {
                navigate("/recruit");
              }else{
                setErrorModal(false);
              }
            }}
          />
        )}

      </div>
    </>
  );
}