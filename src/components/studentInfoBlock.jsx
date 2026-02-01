import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { patchApplicationDecision } from "../api/application";
import { useMutation } from "@tanstack/react-query";
import AlertModal from "./alertModal";
import sendIco from "../assets/images/sendIco.svg";
import { postChatrooms } from "../api/chat";
import { getLastCategoryName } from "../utils/categoryUtils";
// 수정

export default function StudentInfoBlock({ studentInfo, type }) {
  const navigate = useNavigate();
  const user = studentInfo?.member || studentInfo;
  const [applicationId,setApplicationId] = useState();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => patchApplicationDecision(studentInfo?.applicationId, "REJECT"),
    onSuccess: async () => {
      setShowRejectModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500); 
    },
  });

  useEffect(() => {
    setApplicationId(studentInfo.applicationId);
  },[studentInfo]);
  const handleClick = () => {
    const userId = user?.id || studentInfo?.id;
    if (userId) {
      navigate(`/profileDetail/${userId}`);
    }
  };


  const handleChat = async (memberId) => {
    console.log("채팅 멤버: ", memberId);
    
    try {
      const response = await postChatrooms(memberId);

      // 채팅방 생성 후 해당 채팅방으로 이동
      if (response.roomId) {
        navigate(`/chat`);
      } else {
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex flex-col justify-center items-start bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer relative
    ${studentInfo.status === "REJECTED" ? "bg-[#e5e5e5] text-[#5e5e5e] opacity-55 cursor-default" : ""}
  `}
      >
         
        <div className="flex items-start space-x-4" onClick={handleClick}>
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0">
            <img
              src={user?.profileImageUrl || "/src/assets/images/basiclogoimg.png"}
              alt="프로필 사진"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.target.src = "/src/assets/images/basiclogoimg.png";
              }}
            />
            <span className="text-sm text-blue-main mr-2">스프온도: {user?.temperature || 36.5}°C</span>
          </div>

          {/* 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-semibold">{user?.nickname}</h3>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {user?.intro || "소개글이 없습니다."}
            </p>
            {user?.categoryDtoList && user.categoryDtoList.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {user.categoryDtoList.map((category, index) => {
                  const categoryName = getLastCategoryName(category);
                  return categoryName ? (
                    <span key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {categoryName}
                    </span>
                  ) : null;
                })}
              </div>
            )}
            {type === "applicant" && user?.feed?.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">작품</h4>
                <div className="flex space-x-2 overflow-x-auto">
                  {user.feed.slice(0, 3).map((work, index) => (
                    <img
                      key={index}
                      src={
                        work.workImageUrl || work.imageUrl || "/src/assets/images/BasicProfileImg1.png"
                      }
                      alt={`작품 ${index + 1}`}
        
                    />
                  ))}
                </div>
              </div>
            )}

           
          </div>
        </div>
        {(studentInfo.priceOffer || studentInfo.priceReason) && (
          <div>
            {studentInfo.priceOffer && (
              <div className="mb-3 pb-3 border-b border-gray-200">
                <div className="text-sm text-gray-600 mb-1 font-medium">제안 금액</div>
                <div className="text-lg font-bold text-blue-main">{studentInfo.priceOffer}</div>
              </div>
            )}
            {studentInfo.priceReason && (
              <div>
                <div className="text-sm text-gray-600 mb-2 font-medium">제안 사유</div>
                <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">{studentInfo.priceReason}</div>
              </div>
            )}
          </div>
        )}
         {type === "applicant" && (
              <div className="text-sm text-gray-500 mt-4">지원일: {studentInfo?.appliedAt}</div>
            )}


        {/* 거절 버튼 */}
        {studentInfo.status === "PENDING" && (
          <div className="mt-4 w-full flex justify-center items-center gap-2">
          <button
            className="bg-red-500 text-white rounded-[10px] px-4 py-2 cursor-pointer hover:bg-red-600 transition"
            onClick={() => setShowRejectModal(true)}
          >
            거절
          </button>
          <div className=" flex items-center gap-2 bg-blue-main p-2 rounded-lg text-white"  onClick={() => handleChat(user?.id)} >
            채팅하기
            <img className=" w-4 z-[5]" src={sendIco}/>
          </div>
          </div>
        )}
        {studentInfo.status === "ACCEPTED" && (
          <div className="ml-auto text-sm text-green-500 font-medium">
           승인됨
          </div>
        )}
        {studentInfo.status === "REJECTED" && (
          <div className="ml-auto text-sm text-red-500 font-medium">
           거절됨
          </div>
        )}
      </div>
     

      {showRejectModal && (
        <AlertModal
          type="warning"
          title="정말로 거절하시겠습니까?"
          description={`한 번 거절하면 되돌릴 수 없습니다.\n계속하시겠습니까?`}
          TrueBtnText="거절하기"
          FalseBtnText="취소"
          onClickFalse={() => setShowRejectModal(false)}
          onClickTrue={() => mutate(studentInfo?.applicationId)}
        />
      )}

      {showSuccessModal && (
        <AlertModal
          type="success"
          title="거절 완료"
          description="지원자가 성공적으로 거절 처리되었습니다."
          TrueBtnText="확인"
          onClickTrue={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}
