import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../../assets/images/backArrow.svg";
import { deleteFeed, getFeedDetail } from "../../api/feed";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFormattedDate } from "../../utils/getDate";
import {UserStore} from "../../store/userStore";
import { useRef, useEffect } from "react"; 
import AlertModal from "../../components/alertModal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

export default function PostDetail() {
  const navigate = useNavigate();
  const { id, worksId } = useParams();
  const [worksData, setWorksData] = useState([]);
  const [mediaData, setMediaData] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const { memberId } = UserStore();
  const optionsRef = useRef(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

    const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feedDetail"],
    queryFn: async () => {
      const data = await getFeedDetail(id,worksId);
      console.log("feedDetail 결과:", data.result.mediaResDtos);
      setWorksData(data.result);
      setMediaData(data.result.mediaResDtos);
      return data;
    },
    keepPreviousData: true,
  });


  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
  function handleClickOutside(event) {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteFeed(worksId);
      setShowDeleteModal(false);
      setShowCompleteModal(true);
    } catch (err) {
      console.log("실패함");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleCompleteConfirm = () => {
    setShowCompleteModal(false);
    navigate("/");
  };

  return (
    <div className="flex flex-col py-16 px-4 max-w-4xl w-full mx-auto">
      <div className="flex justify-between">
      <button
        className="flex items-center text-gray-600 mb-4 hover:text-black transition-colors"
        onClick={handleGoBack}
      >
        <img src={backArrow} alt="뒤로가기" className="w-6 h-6 mr-1" />
        <span>프로필로 돌아가기</span>
      </button>

      <p className="text-sm text-gray-500 pr-6">
              누적 조회 수 {worksData.view}회
            </p>
            </div>


      <div className="flex flex-row rounded-2xl border border-gray-200 p-6 w-full shadow-sm">
         <div className="flex w-[65%] h-full">
    <Swiper
      pagination={{
        dynamicBullets: true,
      }}
      modules={[Pagination]}
      className="rounded-lg"
    >
      {mediaData?.map((data, i) => {
  const isVideo = data.fileType?.toLowerCase() === "mp4" || data.fileUrl?.toLowerCase().endsWith(".mp4");

  return (
    <SwiperSlide key={i} className="flex justify-center items-center">
      <div className="flex justify-center items-center h-[400px] w-full">
        {isVideo ? (
          <video
            src={`${BUCKET_URL}${data.fileUrl}`}
            controls
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <img
            src={`${BUCKET_URL}${data.fileUrl}`}
            alt={data.fileName}
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>
    </SwiperSlide>
      );
    })}

    </Swiper>
  </div>
          <div className="w-full max-w-[35%] h-full pl-6 relative">
            {/* 본인일 경우에만 */}
          {Number(id) === memberId && (
            <div className="flex justify-end"  ref={optionsRef}>
              <button
                onClick={() => setShowOptions((prev) => !prev)}
                className="text-xl px-2 py-1 rounded hover:bg-gray-100"
              >
                ⋯
              </button>

              {showOptions && (
                <div className="absolute left-[250px] mt-2 w-28 bg-white border rounded shadow-lg z-10">
                  <button
                    onClick={() => navigate("/postEdit", {
                              state: {
                              worksData,
                              mediaData
                            }
                          })}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    수정하기
                  </button>
                  <button
                     onClick={handleDeleteClick}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col justify-between items-start mb-4 h-[80%]">
            <div className=" flex flex-col justify-between items-center text-xl font-semibold leading-snug text-black py-3">
            {worksData.topic}
            </div>
            <div className="flex flex-col justify-between text-sm text-gray-600  h-full border-t border-gray-300 pt-6 ">
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-md">
                {worksData.content}
              </p>
              <p className="flex">{getFormattedDate(worksData.lastModifiedTime)}</p>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <AlertModal
          type="warning"
          title="게시물을 삭제하시겠습니까?"
          description="삭제 후 되돌릴 수 없습니다."
          TrueBtnText="삭제"
          FalseBtnText="취소"
          onClickTrue={handleDeleteConfirm}
          onClickFalse={handleDeleteCancel}
        />
      )}
      {showCompleteModal && (
        <AlertModal
          type="simple"
          title="게시물이 삭제되었습니다."
          TrueBtnText="확인"
          onClickTrue={handleCompleteConfirm}
        />
      )}
    </div>
  );
}