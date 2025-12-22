import { useState } from "react";
import Profile from "../components/studentProfile/profile";
import Pagination from "../components/pagination";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/profile";
import Loading from "../components/loading";
import { MEMBER_ERRORS } from "../constants/user";
//import { handlePublicError } from "../utils/apiErrorHandler";
import { handlePublicApiError } from "../utils/publicApiErrorHandler";
import AlertModal from "../components/alertModal";
import { useNavigate } from "react-router-dom";

export default function StudentProfileList({ firstCategoryId, secondCategoryId }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("잘못된 접근");
  const [errorAction, setErrorAction] = useState("redirect");
  const pageSize = 6;
  const navigate = useNavigate();
  const pageable = {
    page: currentPage,
    size: pageSize,
  };

  const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", firstCategoryId ?? undefined, secondCategoryId ?? undefined, currentPage],
    queryFn: async () => {
      // null을 undefined로 변환하여 API에 전달 (null이면 params에서 제외됨)
      const data = await getProfile(firstCategoryId ?? undefined, secondCategoryId ?? undefined, pageable);
      setTotalPages(data.result?.totalPages || 1);
      // console.log("data", data);
      return data;
    },
    onError: (error) => {
      console.error("프로필 조회 에러:", error);
      handlePublicApiError(error, { setErrorModal, setErrorDescription, setErrorAction }, MEMBER_ERRORS);
    },
    keepPreviousData: true,
    enabled: true, // 항상 쿼리 실행
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const userData = feedData?.result?.content || [];
  // console.log("userData", userData);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
      {errorModal && (
        <AlertModal
        type="simple"
        title="오류 발생"
        description={errorDescription}
        TrueBtnText="확인"
        onClickTrue={() => {
          if (errorAction === "redirect") {
              navigate("/");
          }else if(errorAction === "refresh"){
            setErrorModal(false);
          }else{
            setErrorModal(false);
            //window.location.reload();
          }
        }}
          />
      )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-80">
      {userData && userData.length > 0 ? (
        <>
          <div className="w-full flex flex-col items-center justify-center gap-4 mt-4">
            {userData.map((data) => (
              <Profile
                key={data.id}
                memberId={data.memberId}
                profileImageUrl={data.profileImageUrl}
                temperature={data.temperature}
                userName={data.nickname}
                userDetail={data.userDetail}
                popularFeeds={data.popularFeeds}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            {firstCategoryId || secondCategoryId 
              ? "선택한 카테고리의 대학생 프로필이 없습니다."
              : "대학생 프로필이 없습니다."
            }
          </p>
        </div>
      )}
    </div>
  );
}
