import { useState } from "react";

export default function DeclareModal({
  onClickFalse,
  onClickTrue,
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [description, setDescription] = useState("");

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
        className="flex flex-col bg-white rounded-[25px] p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl font-bold text-black text-center">
          신고 사유
        </div>
        <div className="text-lg font-bold my-4">
          신고 사유를 하나 이상 선택해주세요.
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="reason1" 
              name="reason" 
              value="개인정보 노출"
              checked={selectedReasons.includes(0)}
              onChange={() => handleReasonChange(0)}
            />
            <label htmlFor="reason1" className="text-sm">개인정보 노출</label>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="reason2" 
              name="reason" 
              value="폭력 또는 악의적인 콘텐츠"
              checked={selectedReasons.includes(1)}
              onChange={() => handleReasonChange(1)}
            />
            <label htmlFor="reason2" className="text-sm">폭력 또는 악의적인 콘텐츠</label>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="reason3" 
              name="reason" 
              value="음란성/선정성"
              checked={selectedReasons.includes(2)}
              onChange={() => handleReasonChange(2)}
            />
            <label htmlFor="reason3" className="text-sm">음란성/선정성</label>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="reason4" 
              name="reason" 
              value="부적절한 닉네임 또는 이미지"
              checked={selectedReasons.includes(3)}
              onChange={() => handleReasonChange(3)}
            />
            <label htmlFor="reason4" className="text-sm">부적절한 닉네임 또는 이미지</label>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="reason5" 
              name="reason" 
              value="욕설/인신공격"
              checked={selectedReasons.includes(4)}
              onChange={() => handleReasonChange(4)}
            />
            <label htmlFor="reason5" className="text-sm">욕설/인신공격</label>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="reason6" 
              name="reason" 
              value="저작권 침해"
              checked={selectedReasons.includes(5)}
              onChange={() => handleReasonChange(5)}
            />
            <label htmlFor="reason6" className="text-sm">저작권 침해</label>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="reason7" 
              name="reason" 
              value="반복성 게시글(도배)"
              checked={selectedReasons.includes(6)}
              onChange={() => handleReasonChange(6)}
            />
            <label htmlFor="reason7" className="text-sm">반복성 게시글(도배)</label>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="reason8" 
              name="reason" 
              value="기타"
              checked={selectedReasons.includes(7)}
              onChange={() => handleReasonChange(7)}
            />
            <label htmlFor="reason8" className="text-sm">기타</label>
          </div>
        </div>
        <div className="text-lg font-bold my-4">
          신고 사유를 자세하게 작성해주세요.
        </div>
        <textarea 
          className="w-full py-3 px-3 border border-gray-300 rounded-md focus:outline-none mb-4 resize-none"
          rows="3"
          placeholder=""
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
