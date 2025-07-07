import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApplicationReject } from "../api/application";
import { useMutation } from "@tanstack/react-query";
import AlertModal from "../components/AlertModal"; // 모달 컴포넌트

export default function StudentInfoBlock({ studentInfo, type }) {
  const navigate = useNavigate();
  const user = studentInfo?.member || studentInfo;
  const [applicationId,setApplicationId] = useState();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => postApplicationReject(studentInfo?.applicationId),
    onSuccess: async () => {
      setShowRejectModal(false);
      setShowSuccessModal(true);
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

  /*
  검색 CSS
   {studentInfo.status === "REJECTED" && (
    <div className="flex justify-center items-center absolute inset-0 backdrop-blur-[2px] bg-gray-300 bg-opacity-30 rounded-lg pointer-events-none" >
      <span className="text-3xl text-red-500">거절</span>
    </div>
  )}


  */

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
              src={user?.profileImageUrl || "/src/assets/images/BasicProfileImg1.png"}
              alt="프로필 사진"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.target.src = "/src/assets/images/BasicProfileImg1.png";
              }}
            />
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600 mr-2">스프온도:</span>
              <div className="flex items-center">
                <span className="text-lg font-bold text-orange-500 mr-1">
                  {user?.temperature || 0}
                </span>
                <span className="text-sm text-gray-500">°C</span>
              </div>
            </div>
          </div>

          {/* 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-semibold">{user?.nickname}</h3>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {user?.intro || "소개글이 없습니다."}
            </p>

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
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "/src/assets/images/BasicProfileImg1.png";
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {type === "applicant" && (
              <div className="text-xs text-gray-500">지원일: {studentInfo?.appliedAt}</div>
            )}
          </div>
        </div>

        {/* 거절 버튼 */}
        {studentInfo.status === "PENDING" && (
          <div className="w-full flex justify-center items-center">
          <button
            className="mt-4 bg-red-500 text-white rounded-[10px] px-4 py-2 cursor-pointer hover:bg-red-600 transition"
            onClick={() => setShowRejectModal(true)}
          >
            거절
          </button>
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
