import freeImg from "../../assets/images/freeImg.png";
import estimateImg2 from "../../assets/images/estimateImg2.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserStore } from "../../store/userStore";
import AlertModal from "../alertModal";

export default function FreeEstimate({color}) {
  const navigate = useNavigate();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const { memberId, roleType } = UserStore();

  const checkRecruitUploadAccess = () => {
    if (!memberId) {
      setShowAlertModal(true);
      return false;
    }
    if (roleType !== "MEMBER" && roleType !== "ADMIN") {
      setShowAlertModal(true);
      return false;
    }
    return true;
  };

  const handleRecruitUploadClick = () => {
    if (checkRecruitUploadAccess()) {
      navigate("/recruitUpload");
    }
  };

  return (
    <>
      {color=="black" && (
        <div className="relative bg-neutral-700 w-full rounded-2xl px-12 py-8 flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl font-bold">스프 프로 작업자들의
                <br/>
            투명한 견적을 받아보세요.</h2>
            <h3 className="text-white text-md font-semibold mt-4">연계 학교 단체 / 개인의 다양한 견적</h3>
          </div>
          <div className="flex items-center gap-4">
              <img src={freeImg} alt="freeImg" className="absolute bottom-0 right-60 w-52" />
              <button className="bg-white text-blue-500 text-xl font-bold px-8 py-6 rounded-xl"
              onClick={handleRecruitUploadClick}>무료 외주 견적 받기</button>
          </div>
        </div>
      )}
      {color=="blue" && (
        <div className="relative bg-blue-500 w-full rounded-2xl px-12 py-8 flex justify-between items-center">
          <div>
            <h2 className="text-orange-100 text-xl font-bold">웹사이트 제작<span className="text-white"> 견적을 무료로 받아보세요!</span></h2>
            <h3 className="text-white text-xl font-bold mt-2">인증된 전문가들이 견적을 보내요</h3>
          </div>
          <button className="bg-white text-blue-500 text-xl font-bold px-8 py-6 rounded-xl"
          onClick={handleRecruitUploadClick}>무료로 프로젝트 등록</button>
        </div>
      )}
      {color=="yellow" && (
        <div className="relative bg-yellow-main w-full rounded-2xl px-12 py-2 flex justify-between items-center">
          <div className="flex">
          <div className="flex flex-col gap-2 mb-auto mt-6">
            <h2 className="text-white text-xl font-bold">스프 프로 작업자들의</h2>
            <h3 className="text-white text-xl font-bold mt-2">인증된 전문가들이 견적을 보내요</h3>
          </div>
          <img src={estimateImg2} alt="estimateImg2" className="w-64" />
          </div>
          <button className="bg-white text-black text-xl font-bold px-8 py-6 rounded-3xl shadow-lg"
          onClick={handleRecruitUploadClick}>무료 외주 견적 받기</button>
         
        </div>
      )}

      {/* Alert Modal */}
      {showAlertModal && (
        <AlertModal
          type="simple"
          title="로그인 후 이용해주세요."
          description="외주 등록은 일반 회원만 이용할 수 있습니다."
          TrueBtnText="로그인하러 가기"
          FalseBtnText="취소"
          onClickTrue={() => {
            setShowAlertModal(false);
            navigate("/login");
          }}
          onClickFalse={() => setShowAlertModal(false)}
        />
      )}
    </>
  )
}