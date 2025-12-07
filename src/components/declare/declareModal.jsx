import { useState } from "react";
import ReasonCheckbox from "../ReasonCheckbox";
import { postReport } from "../../api/report";
import { handleApiError } from "../../utils/apiErrorHandler";
import AlertModal from "../alertModal";
import { REPORT_ERRORS } from "../../constants/report";
import { useNavigate } from "react-router-dom";

export default function DeclareModal({
  isOpen,
  onClose,
  onSubmit,
  postType,
  postId,
  title,
  reporterId,
  reportedMemberId,
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [description, setDescription] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("잘못된 접근입니다.");
  const [errorAction, setErrorAction] = useState(null);
  const navigate = useNavigate();
  // 신고 사유 목록
  const reasonList = [
    "개인정보 노출",
    "폭력 또는 악의적인 콘텐츠",
    "음란성/선정성",
    "부적절한 닉네임 또는 이미지",
    "욕설/인신공격",
    "저작권 침해",
    "반복성 게시글(도배)",
    "기타"
  ];

  const handleReasonChange = (index) => {
    if (selectedReasons.includes(index)) {
      setSelectedReasons(selectedReasons.filter(reason => reason !== index));
    } else {
      setSelectedReasons([...selectedReasons, index]);
    }
  };

  const handleSubmit = async () => {
    if (selectedReasons.length === 0) {
      alert("신고 사유를 하나 이상 선택해주세요.");
      return;
    }
    if(!description){
      alert("신고 사유를 자세하게 작성해주세요.");
      return;
    }

    // 필수 필드 검증
    if (!postType || postId === null || postId === undefined || !title || reporterId === null || reportedMemberId === null || reportedMemberId === undefined) {
      console.error("신고 필수 필드 누락:", {
        postType,
        postId,
        title,
        reporterId,
        reportedMemberId
      });
      
      return;
    }

    // selectedReasons를 1부터 시작하는 숫자 배열로 변환 (인덱스 + 1)
    const reasons = selectedReasons.map(index => index + 1);

    // 전송할 데이터 확인
    const reportData = {
      postType,
      postId: Number(postId),
      title,
      reporterId: Number(reporterId),
      reportedMemberId: Number(reportedMemberId),
      reasons,
      description
    };

    try {
      const response = await postReport(postType, postId, title, reporterId, reportedMemberId, reasons, description);
  
      setIsSubmitted(true);
      
      if (onSubmit) {
        onSubmit({
          reasons: selectedReasons,
          description: description
        });
      }
    } catch (error) {
      console.error("신고 접수 실패:", error);
      console.error("신고 에러 상세:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: reportData
      });
      handleApiError(error, { setShowLoginModal, setErrorModal, setErrorDescription, setErrorAction }, REPORT_ERRORS)
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };
  


  if (isSubmitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
        <div
          className="flex flex-col bg-white rounded-[25px] p-6 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-3xl font-bold text-black text-center mb-6">
            신고가 접수되었습니다.
          </div>
          <div className="text-base mb-8 leading-relaxed">
            회원님의 신고는 기업과 대학생을 연결하는 스프의 목적성을 <br/>
            위반하는 행위를 적발하는 데 많은 도움이 되었습니다.
            <br />
            <br />
            스프에 지속적인 관심을 가져주신 것에 감사드리며, <br/>
            앞으로도 운영 규칙을 위반하는 게시글을 확인하시면 <br/>
            신고 기능을 적극적으로 이용해주시길 바랍니다.
            <br/>
            <br/>
            감사합니다.
          </div>
          <div className="w-full flex justify-center">
            <button
              className="py-3 px-8 bg-blue-main rounded-[10px] font-semibold text-base text-white"
              onClick={handleClose}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
    >
      <div
        className="flex flex-col bg-white rounded-[25px] p-6 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl font-bold text-black text-center">
          신고 사유
        </div>
        <div className="text-lg font-bold my-4">
          신고 사유를 하나 이상 선택해주세요.
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {reasonList.map((reason, index) => (
            <ReasonCheckbox
              key={index}
              index={index}
              label={reason}
              isSelected={selectedReasons.includes(index)}
              onChange={handleReasonChange}
            />
          ))}
        </div>
        <div className="text-lg font-bold my-4">
          신고 사유를 자세하게 작성해주세요.
        </div>
        <textarea 
          className="w-full py-3 px-3 border border-gray-300 rounded-md focus:outline-none mb-2 resize-none"
          rows="3"
          placeholder=""
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="text-sm text-gray-500 mb-4">
        허위 신고가 확인될 경우, 해당 신고자에게<br/>
        불이익이나 제재가 적용될 수 있으니, 신중하게 신고 부탁드립니다.
        </div>
        <div className="w-full px-1 flex justify-center gap-8"> 
          <button
            className="py-3 px-8 bg-[#C9C9C9] rounded-[10px] font-semibold text-base"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="py-3 px-8 bg-blue-main rounded-[10px] font-semibold text-base text-white"
            onClick={handleSubmit}
          >
            신고
          </button>
        </div>
      </div>
      {showLoginModal && (
       <AlertModal
       type="simple"
       title="로그인이 필요합니다"
       description="SouF 회원만 신고가 가능합니다."
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
            title="신고 오류"
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
