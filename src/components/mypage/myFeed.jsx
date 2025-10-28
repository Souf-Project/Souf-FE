import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import basiclogoimg from "../../assets/images/basiclogoimg.png";
import { getMemberFeed } from "../../api/feed";
import { UserStore } from "../../store/userStore";
import { FEED_ERRORS } from "../../constants/post";
import AlertModal from "../alertModal";

export default function MyFeed() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [userWorks, setUserWorks] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("잘못된 접근");
  const [errorAction, setErrorAction] = useState("redirect");
  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;
  const {memberId} = UserStore();

  const { isLoading, error } = useQuery({
    queryKey: ["myFeed", memberId],
    queryFn: async () => {
      try{
        const data = await getMemberFeed(memberId);
        setUserData(data.result.memberResDto);
        console.log("미디어", data.result.feedSimpleResDtoPage.content);
        setUserWorks(data.result.feedSimpleResDtoPage.content);
      return data;
      } catch (error) {
        console.error("피드 데이터를 가져오는 중 에러가 발생했습니다:", error);
        // throw err;
        //err?.response?.data?.errorKey
        const errorKey = error?.response?.data?.errorKey;
        debugger;
        if (error.response.status === 403) {
                setShowLoginModal(true);
        }else{
          const errorInfo = FEED_ERRORS[errorKey];
          setErrorModal(true);
          setErrorDescription(errorInfo?.message || "알 수 없는 오류가 발생했습니다.");
          setErrorAction(errorInfo?.action || "redirect");
        }
      }
    },
    keepPreviousData: true,
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const onWorkClick = (worksId) => {
    navigate(`/profileDetail/${userData.id}/post/${worksId}`);
  };

  return (
    <div className="flex flex-col px-4 max-w-4xl w-full">
        <div className="flex gap-12 mb-6 pl-6">
          <img
            src={
              userData?.profileImageUrl
                ? userData.profileImageUrl
                : basiclogoimg
            }
            className="rounded-full w-1/4"
          />
          <div className="flex flex-col gap-2 mt-4 w-full">
            <div className="font-semibold text-[23px]">
              {userData?.nickname}
            </div>
            <div className="text-[#5B5B5B]">{userData?.intro}</div>
            <div className="text-[#5B5B5B]">{userData?.personalUrl}</div>
          </div>
        </div>

        <hr className="border-t border-gray-200 my-6" />

        <div className="grid grid-cols-3 justify-center w-full gap-1 cursor-pointer">
          {userWorks?.map((data) => (
            <div className="flex justify-center items-center h-[250px] overflow-hidden">
                <img
                    key={data.feedId}
                    src={`${S3_BUCKET_URL}${data.mediaResDto?.fileUrl}`}
                    className="w-full h-full object-cover"
                    onClick={() => onWorkClick(data.feedId)}
                    alt="피드 이미지"
                />
            </div>

          ))}
        </div>
      {showLoginModal && (
        <AlertModal
        type="simple"
        title="로그인이 필요합니다"
        description="SouF 회원만 접근 가능합니다!"
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
        title="잘못된 접근"
        description={errorDescription}
        TrueBtnText="확인"
        onClickTrue={() => {
          if (errorAction === "redirect") {
              localStorage.clear();
              navigate("/login");
          }
        }}
          />
      )}
    </div>
  );
}
