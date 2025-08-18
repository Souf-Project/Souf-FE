import { useState } from "react";
import ReasonCheckbox from "../ReasonCheckbox";

export default function DeclareModal({
  onClickFalse,
  onClickTrue,
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [description, setDescription] = useState("");

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

    try {
      console.log("사유 인덱스:", selectedReasons);
      console.log("인덱스 이름:", selectedReasons.map(index => reasonList[index]));
      console.log("신고 사유 설명:", description);
      // 여기에 신고 API 추가
    
      setIsSubmitted(true);
    } catch (error) {
      console.error("신고 접수 실패:", error);
      alert("신고 접수에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleClose = () => {
    onClickFalse();
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
        <div
          className="flex flex-col bg-white rounded-[25px] p-6 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-3xl font-bold text-black text-center mb-6">
            게시물 신고가 접수되었습니다.
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
              className="py-3 px-8 bg-yellow-main rounded-[10px] font-semibold text-base"
              onClick={handleClose}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={onClickFalse}
          >
            취소
          </button>
          <button
            className="py-3 px-8 bg-yellow-main rounded-[10px] font-semibold text-base"
            onClick={handleSubmit}
          >
            신고
          </button>
        </div>
      </div>
    </div>
  );
}
