import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserStore } from '../../store/userStore';
import { getMyApplications, cancelApplication } from '../../api/application';
import firstCategoryData from '../../assets/categoryIndex/first_category.json';
import secondCategoryData from '../../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../../assets/categoryIndex/third_category.json';

import AlertModal from '../alertModal';
import Loading from '../loading';
import { handleApiError } from '../../utils/apiErrorHandler';
import { APPLICATION_ERRORS } from '../../constants/application';

export default function ApplicationsContent() {
  const navigate = useNavigate();
  const { roleType } = UserStore();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedRecruitId, setSelectedRecruitId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("잘못된 접근입니다.");
  const [errorAction, setErrorAction] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const getCategoryNames = (categoryDtos) => {
    if (!categoryDtos || categoryDtos.length === 0) {
      return [];
    }

    // 대분류와 중분류가 같은 것들을 그룹화
    const groupedCategories = {};
    
    categoryDtos.forEach(dto => {
      const firstCatId = dto.firstCategory;
      const secondCatId = dto.secondCategory;
      const thirdCatId = dto.thirdCategory;

      const firstName = firstCategoryData.first_category.find(
        cat => cat.first_category_id === firstCatId
      )?.name || '';

      // secondCategory가 null이거나 유효하지 않으면 빈 문자열
      const secondName = secondCatId 
        ? (secondCategoryData.second_category.find(
            cat => cat.second_category_id === secondCatId
          )?.name || '')
        : '';

      // thirdCategory가 null이거나 유효하지 않으면 빈 문자열
      const thirdName = thirdCatId
        ? (thirdCategoryData.third_category.find(
            cat => cat.third_category_id === thirdCatId
          )?.name || '')
        : '';

      const key = `${firstCatId}-${secondCatId}`;
      
      if (!groupedCategories[key]) {
        groupedCategories[key] = {
          first: firstName,
          second: secondName,
          thirds: []
        };
      }
      
      groupedCategories[key].thirds.push(thirdName);
    });

    return Object.values(groupedCategories);
  };

  const handleDetailView = (recruitId) => {
    // 여기 디테일 데이터 어떻게 불러올지 수정해야함
    navigate(`/recruitDetails/${recruitId}`);
  };

  const handleRowClick = (app, e) => {
    // 버튼 클릭 시에는 행 클릭 이벤트가 발생하지 않도록
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    
    // priceOffer 또는 priceReason이 있으면 모달 표시
    if (app.priceOffer || app.priceReason) {
      setSelectedApplication(app);
      setShowPriceModal(true);
    } else {
      // 없으면 기존처럼 상세 페이지로 이동
      handleDetailView(app.recruitId);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      if (roleType !== 'STUDENT') return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getMyApplications();
        // console.log('지원 내역 조회 성공:', response.data);
        setApplications(response.data.result?.content || []);
      } catch (error) {
        console.error('지원 내역 조회 실패:', error);
        setError('지원 내역을 불러오는데 실패했습니다.');
        debugger;
        handleApiError(error,{setShowLoginModal,setErrorModal,setErrorDescription,setErrorAction},APPLICATION_ERRORS);
        console.log(showLoginModal);
        debugger;
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [roleType]);
  
  const openCancelModal = (recruitId) => {
    setSelectedRecruitId(recruitId);
    setShowAlertModal(true);
  };

  const handleCancelApplication = async (recruitId) => {
    if (!recruitId) return;
    
    try {
      await cancelApplication(recruitId);
      console.log('지원 취소 성공:', recruitId);
      
      // 지원 목록에서 해당 항목 제거
      setApplications(prev => prev.filter(app => app.recruitId !== recruitId));
      
      setShowAlertModal(false);
      setSelectedRecruitId(null);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('지원 취소 실패:', error);
      //alert('지원 취소에 실패했습니다.');
      handleApiError(error,{setShowLoginModal,setErrorModal,setErrorDescription,setErrorAction},APPLICATION_ERRORS);
    }
  };
  

  // STUDENT가 아닌 경우 빈 div 반환
  if (roleType !== 'STUDENT') {
    return <div></div>;
  }

  if (loading) {
    return <Loading text="지원 내역을 불러오는 중..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <p className="text-red-500">{error}</p>
{showLoginModal && (
       <AlertModal
       type="simple"
       title="로그인이 필요합니다"
       description="SouF 학생 회원만 접근 가능합니다."
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
            title="공고문 오류"
            description={errorDescription}
            TrueBtnText="확인"
            onClickTrue={() => {
              setErrorModal(false);
              if (errorAction === "redirect") {
                location.reload();
              }else{
                location.reload();
              }
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      {applications.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공고문 제목</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">진행상태</th>
                <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지원일</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지원상태</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => {
                const categoryNames = getCategoryNames(app.categoryDtos);
                return (
                  <tr 
                    key={app.recruitId}
                    className={`${app.priceOffer || app.priceReason ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    onClick={(e) => handleRowClick(app, e)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="text-sm font-medium text-gray-900 underline cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDetailView(app.recruitId);
                        }}
                      >
                        {app.title} 🔍
                      </div>
                      <div className="text-sm text-gray-500">{app.nickname}</div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {categoryNames.map((category, index) => (
                          <div key={index}>
                            - {category.first}
                            {category.second && category.second.trim().length > 0 && (
                              <>
                                <br/>{'>'} {category.second}
                              </>
                            )}
                            {category.thirds && category.thirds.length > 0 && category.thirds.some(t => t && t.trim().length > 0) && (
                              <>
                                <br/>{'>'} {category.thirds.filter(t => t && t.trim().length > 0).join(', ')}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${app.recruitable ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {app.recruitable ? '모집 중' : '마감'}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{app.appliedAt}</div>
                    </td>
                    <td className="px-2 md:px-3 text-center text-sm font-medium">
                      <div className="flex flex-col gap-2 items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${app.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' : 
                            app.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {app.status === 'ACCEPTED' ? '합격' : 
                           app.status === 'REJECTED' ? '거절' : 
                           '검토중'}
                        </span>
                        {app.status === 'PENDING' && (
                          <button 
                            className="hover:opacity-70 transition-opacity bg-red-500 text-white px-2 py-2 rounded-md text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              openCancelModal(app.applicationId);
                            }}
                          >
                            지원취소
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">아직 지원한 외주가 없습니다.</p>
        </div>
      )}
      {showAlertModal && (
        <AlertModal
                  type="warning"
          title="지원 취소"
          description="지원을 취소하시면 지원 내역에서 삭제됩니다."
          FalseBtnText="취소"
          TrueBtnText="확인"
          onClickFalse={() => setShowAlertModal(false)}
          onClickTrue={() => handleCancelApplication(selectedRecruitId)}
          onClose={() => setShowAlertModal(false)}
        />
      )}
      {showSuccessModal && (
        <AlertModal
          type="success"
          title="지원 취소 완료"
          description="지원이 성공적으로 취소되었습니다."
          TrueBtnText="확인"
          onClickTrue={() => setShowSuccessModal(false)}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {showLoginModal && (
       <AlertModal
       type="simple"
       title="로그인이 필요합니다"
       description="SouF 학생 회원만 접근 가능합니다."
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
            title="공고문 오류"
            description={errorDescription}
            TrueBtnText="확인"
            onClickTrue={() => {
              setErrorModal(false);
              if (errorAction === "redirect") {
                location.reload();
              }else{
                location.reload();
              }
            }}
          />
        )}
        {showPriceModal && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowPriceModal(false)}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">제안 내역</h3>
                <button 
                  onClick={() => setShowPriceModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              {selectedApplication.priceOffer && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1 font-medium">제안 금액</div>
                  <div className="text-lg font-bold text-blue-main">{selectedApplication.priceOffer}</div>
                </div>
              )}
              {selectedApplication.priceReason && (
                <div>
                  <div className="text-sm text-gray-600 mb-2 font-medium">제안 사유</div>
                  <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedApplication.priceReason}</div>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPriceModal(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}; 