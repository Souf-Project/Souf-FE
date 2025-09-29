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


const parsePayment = (paymentString) => {
  if (!paymentString || typeof paymentString !== 'string') return null;
  let numStr = paymentString.replace(/[^0-9.]/g, '');
  let num = parseFloat(numStr);
  if (paymentString.includes('만')) {
    num *= 10000;
  }
  return isNaN(num) ? null : num;
};

const formatPayment = (paymentString) => {
  if (!paymentString || typeof paymentString !== 'string') return '금액 협의';
  return paymentString;
};

// 닉네임 마스킹 함수
const maskNickname = (nickname) => {
  if (!nickname) return '';
  if (nickname.length <= 2) return nickname;
  return nickname.charAt(0) + '*'.repeat(nickname.length - 2) + nickname.charAt(nickname.length - 1);
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
  const price = formatPayment(recruitDetail?.price);
  const maxPrice = parsePayment(recruitDetail?.price);
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
    price,
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
     
      
      <div className="flex w-full mx-auto max-w-[60rem] pb-40">
        <div className="w-5/6 mx-auto pt-4 mr-4">
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
                contentType="공고문" 
                iconClassName="w-5 h-5 cursor-pointer"
              />
            )}
          </div>
          <div className="flex items-center gap-2 my-2">
          {categoryNames.map((category, index) => (
        
        <div key={index}>
          {category.third ? (
            <span className="font-medium text-black">#{category.third}</span>
          ) : category.second ? (
            <span>#{category.second}</span>
          ) : (
            <span>#{category.first}</span>
          )}
        </div>
      ))}
          </div>
         
          <div className="text-xl font-bold mb-2">{displayData?.nickname}</div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-700 text-lg font-bold">프로젝트 소개</span>
            <div className="text-white font-semibold bg-blue-main px-3 py-1 rounded-md">팝업</div>
            <div className="text-white font-semibold bg-blue-main px-3 py-1 rounded-md">패션디자인 전공</div>
          </div>

          <div className="border-t border-gray-200 my-4 sm:my-6"></div>
          <div>
             <p className="text-xl font-semibold text-black mb-4">
               기업 소개
             </p>
             <div className="prose prose-lg max-w-none text-gray-800 mb-4">
               <ReactMarkdown 
                 remarkPlugins={[remarkGfm]}
                 rehypePlugins={[rehypeRaw]}
                 components={{
                   u: ({children}) => <u>{children}</u>,
                   strong: ({children}) => <strong>{children}</strong>,
                   em: ({children}) => <em>{children}</em>,
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
        </div>
        {/* 우측 외주 조건 */}
        <div className="sticky top-24 w-1/4 bg-[#FCFCFC] mt-10 p-6 h-fit rounded-lg shadow-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 mb-1">급여</span>
                <span className="font-lg">
                  {maxPrice
                    ? `${maxPrice.toLocaleString()}원`
                    : '금액 협의'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 mb-1">납기일</span>
                <span className="font-lg">{formatDate(displayData?.deadline)}</span>
              </div>
            </div>
            {isAuthor ? (
            <></>
          ) : (
            <div className="flex justify-between gap-4 mt-6 mb-4">
              <button className="bg-zinc-300 text-black w-1/2 py-2 rounded-lg text-lg font-bold">문의하기</button>
              {recruitDetail?.recruitable ? (
                <button className="bg-blue-main text-white w-1/2 py-2 rounded-lg text-lg font-bold">{maxPrice ? '지원하기' : '견적 보내기'}</button>
              ) : (
                <button className="bg-gray-400 text-black w-1/2 py-2 rounded-lg text-lg font-bold cursor-not-allowed" disabled>지원 마감</button>
              )}
            </div>
          )}
          <span className="text-zinc-500">이 외주를 총 <span className="text-black font-bold">32명</span>이 조회하였습니다.</span>
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