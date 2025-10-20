// PostEdit.js
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Button from "../components/button";
import PostInput from "../components/postInput";
import ImageUpload from "../components/post/imageUpload";
import CategorySelectBox from "../components/categorySelectBox";
import { updateFeed, uploadToS3, postMedia } from "../api/feed";
import {
  postVideoSignedUrl,
  postVideoUpload,
  uploadToS3Video,
} from "../api/video";
import AlertModal from "../components/alertModal";
import { filterEmptyCategories } from "../utils/filterEmptyCategories";
import { FEED_ERRORS } from "../constants/post";

const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

export default function PostEdit() {
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const { id, worksId } = useParams();
  const location = useLocation();
  const { worksData, mediaData } = location.state || {};

  const [existingImages, setExistingImages] = useState([]); // 기존 이미지
  const [newImages, setNewImages] = useState([]); // 새로 추가된 이미지들
  const [newVideo, setNewVideo] = useState();
  const [newFiles, setNewFiles] = useState([]);

  const [formData, setFormData] = useState({
    topic: worksData?.topic || "",
    content: worksData?.content || "",
    categoryDtos: worksData?.categoryDtos || [
      { firstCategory: null, secondCategory: null, thirdCategory: null },
      { firstCategory: null, secondCategory: null, thirdCategory: null },
      { firstCategory: null, secondCategory: null, thirdCategory: null },
    ],
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("잘못된 접근");
  const [errorAction, setErrorAction] = useState("redirect");

  useEffect(() => {
    if (mediaData?.length) {
      const formatted = mediaData.map((img) => ({
        ...img,
        preview: `${BUCKET_URL}${img.fileUrl}`,
      }));
      setExistingImages(formatted);
    }
  }, [mediaData]);

  const handleImagesChange = (images) => {
    // 새 이미지: File 인스턴스
    const onlyNewImages = images.filter(
      (img) => img instanceof File && img.type.startsWith("image")
    );
    const onlyNewVideo = images.find(
      (img) => img instanceof File && img.type.startsWith("video/")
    );

    const remainingExisting = images.filter((img) => !(img instanceof File));
    const newFile = images.filter((img) => img instanceof File);
    //setExistingImages();

    setNewImages(onlyNewImages);
    setNewVideo(onlyNewVideo);

    setExistingImages(remainingExisting);
    setNewFiles(newFile);
  };

  const handleExistingImageDelete = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const handleInputChange = (name, e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (index) => (categoryData) => {
    setFormData((prev) => {
      const updated = prev.categoryDtos.map((cat, i) =>
        i === index ? categoryData : cat
      );
      return { ...prev, categoryDtos: updated };
    });
  };

  const handleApiError = (error) => {
    debugger;
    const errorKey = error?.response?.data?.errorKey;
    if (error?.response?.status === 403) {
      setShowLoginModal(true);
    } else {
      const errorInfo = FEED_ERRORS[errorKey];
      setErrorDescription(errorInfo?.message || "알 수 없는 오류가 발생했습니다.");
      setErrorAction(errorInfo?.action || "redirect");
      setErrorModal(true);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (updateData) => {
      return updateFeed(worksData.feedId, updateData);
    },
    onSuccess: async (response) => {
      const { feedId, dtoList, videoResDto } = response.result;
      try {
        // 1. 이미지가 있다면 업로드
        if (newImages.length > 0 && dtoList?.length > 0) {
          await Promise.all(
            dtoList.map(({ presignedUrl }, i) =>
              uploadToS3(presignedUrl, newImages[i])
            )
          );
        }

        // 2. 비디오가 있다면 멀티파트 업로드
        let multiUploadArray = [];
        if (newVideo && newVideo instanceof File && videoResDto?.uploadId) {
          const chunkSize = 10 * 1024 * 1024;
          const chunkCount = Math.ceil(newVideo.size / chunkSize);
          let getSignedUrlRes = "";

          for (let uploadCount = 1; uploadCount <= chunkCount; uploadCount++) {
            const start = (uploadCount - 1) * chunkSize;
            const end = uploadCount * chunkSize;
            const fileBlob =
              uploadCount < chunkCount
                ? newVideo.slice(start, end)
                : newVideo.slice(start);

            getSignedUrlRes = await postVideoSignedUrl({
              uploadId: videoResDto.uploadId,
              partNumber: uploadCount,
              fileName: videoResDto.fileName,
            });

            const presignedUrl = getSignedUrlRes.result.presignedUrl;
            const uploadResp = await uploadToS3Video(presignedUrl, fileBlob);

            const ETag = uploadResp.headers
              .get("ETag")
              ?.replaceAll("\\", "")
              .replaceAll('"', "");

            multiUploadArray.push({
              awsETag: ETag,
              partNumber: uploadCount,
            });
          }

          await postVideoUpload({
            uploadId: videoResDto.uploadId,
            fileName: videoResDto.fileName,
            parts: multiUploadArray,
          });
        }

        // 3. 미디어 등록은 이미지나 비디오 중 하나라도 있을 때만
        if ((newImages.length > 0 || newVideo) && dtoList?.length > 0) {
          const fileUrls = dtoList.map((d) => d.fileUrl);
          const fileNames = newImages.map((f) => f.name);
          const fileTypes = newImages.map((f) =>
            f.type?.split("/")[1]?.toUpperCase()
          );

          if (newVideo && getSignedUrlRes?.result?.fileUrl) {
            fileUrls.push(getSignedUrlRes.result.fileUrl);
            fileNames.push(newVideo.name);
            fileTypes.push(newVideo.type.split("/")[1].toUpperCase());
          }

          await postMedia({
            feedId,
            fileUrl: fileUrls,
            fileName: fileNames,
            fileType: fileTypes,
          });
        }

        setIsModal(true);
      } catch (err) {
        console.error("업로드 실패:", err);
        handleApiError(err);
      }
    },
    onError: (err) => {
      console.error("업로드 실패:", err);
      handleApiError(err);
    },
  });

  const handleSubmit = () => {
    if (!formData.topic.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const cleanedCategories = filterEmptyCategories(formData.categoryDtos);
    if (cleanedCategories.length === 0) {
      alert("최소 1개 이상의 카테고리를 선택해주세요.");
      return;
    }

    const hasNewMedia = newImages.length > 0 || newVideo;
    const hasExistingMedia = existingImages.length > 0;
    if (!hasNewMedia && !hasExistingMedia) {
      alert("이미지 또는 영상을 1개 이상 첨부해주세요.");
      return;
    }
    const finalData = {
      ...formData,
      categoryDtos: cleanedCategories,
    };
    mutate({
      ...formData,
      categoryDtos: cleanedCategories,
      existingImageUrls: existingImages?.map((img) => {
        // 'https://iamsouf-bucket.s3.ap-northeast-2.amazonaws.com/feed/original/aaa.png'
        // → 'feed/original/aaa.png' 만 추출
        //const url = new URL(img.preview);
        return img.fileUrl; // '/feed/original/...' → 'feed/original/...'
      }),
      originalFileNames: newFiles?.map((file) => file.name),
    });
  };
  useEffect(() => {
    if (worksData?.categoryDtos) {
      const existing = worksData.categoryDtos;
      const toAdd = 3 - existing.length;
      const filled = [
        ...existing,
        ...Array.from({ length: toAdd }, () => ({
          firstCategory: null,
          secondCategory: null,
          thirdCategory: null,
        })),
      ];
      setFormData((prev) => ({
        ...prev,
        categoryDtos: filled,
      }));
    }
  }, [worksData]);

  return (
    <div className="max-w-4xl mx-auto my-10">
      <div className="w-[1000px] border-2 flex flex-col justify-center items-left p-10 gap-4">
        <div className="text-center font-bold text-4xl">게시물 수정</div>

        <PostInput
          title="주제"
          value={formData.topic}
          onChange={(e) => handleInputChange("topic", e)}
        />
        <PostInput
          title="내용"
          inputHeight="h-36"
          value={formData.content}
          onChange={(e) => handleInputChange("content", e)}
          maxLength={300}
        />

        <div className="flex gap-2 w-full">
          {formData?.categoryDtos?.map((category, index) => (
            <CategorySelectBox
              key={index}
              defaultValue={category}
              onChange={handleCategoryChange(index)}
              isEditing={true}
              type="text"
              title=""
              content=""
            />
          ))}
        </div>

        <ImageUpload
          initialImages={mediaData}
          onImagesChange={handleImagesChange}
          onDeleteExistingImage={handleExistingImageDelete}
        />

        <div className="flex gap-4 items-center justify-center">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`px-6 py-3 rounded-lg font-bold transition-colors duration-200 ${
              isPending
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-yellow-main text-black hover:bg-yellow-600'
            }`}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                수정 중...
              </div>
            ) : (
              '수정 완료'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors duration-200"
          >
            취소
          </button>
        </div>
      </div>
      {isModal && (
        <AlertModal
          type="simple"
          title="게시글 작성이 완료되었습니다."
          TrueBtnText="확인"
          onClickTrue={() => navigate("/recruit?category=1")}
        />
      )}
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
      {errorModal && (
        <AlertModal
        type="simple"
        title="오류 발생"
        description={errorDescription}
        TrueBtnText="확인"
        onClickTrue={() => {
          if (errorAction === "redirect") {
              navigate("/feed");
          }else if(errorAction === "login"){
            localStorage.clear();
            navigate("/login");
          }else{
            window.location.reload();
          }
        }}
          />
      )}
    </div>
  );
}