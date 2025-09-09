import { useEffect, useState } from "react";
import { usePopularRecruit } from "../../hooks/usePopularRecruit";
import { getSecondCategoryNameById } from "../../utils/getCategoryById";
import { calculateDday } from "../../utils/getDate";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../../store/userStore";
import AlertModal from "../alertModal";
import { getRecruitDetail } from "../../api/recruit";

export default function BestRecruit() {
  const [recruitData, setRecruitData] = useState([]);
  const navigate = useNavigate();
  const { memberId } = UserStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pageable = { page: 0, size: 5};

  const { data, isLoading } = usePopularRecruit(pageable);
  console.log(data)
  useEffect(() => {
    setRecruitData(data?.result || []);
  }, [data]);

  const parsePayment = (paymentString) => {
    if (!paymentString || typeof paymentString !== 'string') return 0;
    let numStr = paymentString.replace(/[^0-9.]/g, '');
    let num = parseFloat(numStr);
    if (paymentString.includes('만')) {
      num *= 10000;
    }
    return isNaN(num) ? 0 : num;
  };

  const handleClick = async (recruitId) => {
    if (!memberId) {
      setShowLoginModal(true);
    } else {
      try {
        const selectedRecruit = recruitData.find(recruit => recruit.recruitId === recruitId);
        const minPrice = parsePayment(selectedRecruit?.minPayment);
        const maxPrice = parsePayment(selectedRecruit?.maxPayment);
        
        const response = await getRecruitDetail(recruitId);
        console.log('Recruit detail response:', response);
        
        const recruitDetail = response.data.result;
        
        navigate(`/recruitDetails/${recruitId}`, {
          state: {
            title: selectedRecruit?.title,
            content: selectedRecruit?.content,
            cityName: selectedRecruit?.cityName,
            cityDetailName: selectedRecruit?.cityDetailName,
            minPrice,
            maxPrice,
            deadline: selectedRecruit?.deadLine,
            location: selectedRecruit?.cityName,
            preferMajor: false, 
            id: recruitId,
            recruitDetail,
            categoryDtoList: selectedRecruit?.categoryDtoList,
          }
        });
      } catch (error) {
        console.error('Error fetching recruit detail:', error);
        
        // 403 에러인 경우 로그인 모달 표시
        if (error.response?.status === 403) {
          setShowLoginModal(true);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-point"></div>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <div className="grid grid-cols-1 gap-2">
        {recruitData.map((recruit) => (
          <div
            key={recruit.recruitId}
            className="w-full h-32 cursor-pointer"
            onClick={() => handleClick(recruit?.recruitId)}
          >
            <div className="h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 p-4">
              {/* 카드 내용 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-NanumGothicCoding text-blue-500 text-lg font-normal bg-stone-50 rounded-[30px] px-4 py-1 text-center">
                      {calculateDday(recruit?.deadLine, recruit?.recruitable)}
                  </span>
                  <span className="text-neutral-500 text-lg font-bold">
                    {getSecondCategoryNameById(recruit.secondCategory)}
                  </span>
                </div>
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {recruit.title}
                  </h3>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-neutral-500 text-lg font-bold">
                    {recruit.nickname}
                  </p>
                  <p className="text-neutral-500 text-lg font-bold">{recruit.maxPayment}</p>
                  </div>
                </div>
                
             
            </div>
          </div>
        ))}
      </div>
      {showLoginModal && (
        <AlertModal
          type="simple"
          title="로그인이 필요합니다"
          description="SouF 회원만 상세 글을 조회할 수 있습니다!"
          TrueBtnText="로그인하러 가기"
          FalseBtnText="취소"
          onClickTrue={() => {
            setShowLoginModal(false);
            navigate("/login");
          }}
          onClickFalse={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}