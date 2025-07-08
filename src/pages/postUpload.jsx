import { useMutation } from "@tanstack/react-query";
// import Button from "../components/button";
// import Hashtag from "../components/post/hashtag";
import ImageUpload from "../components/post/imageUpload";
import PostInput from "../components/postInput";
import { postFeed, postMedia, uploadToS3 } from "../api/feed";
import { useEffect, useState } from "react";
import CategorySelectBox from "../components/categorySelectBox";
import { useNavigate } from "react-router-dom";
import AlertModal from "../components/alertModal";
import {
  postVideoSignedUrl,
  postVideoUpload,
  uploadToS3Video,
} from "../api/video";
import { filterEmptyCategories } from "../utils/filterEmptyCategories";

export default function PostUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: "",
    content: "",
    tags: [],
    originalFileNames: [],
    categoryDtos: [
      {
        firstCategory: null,
        secondCategory: null,
        thirdCategory: null,
      },
      {
        firstCategory: null,
        secondCategory: null,
        thirdCategory: null,
      },
      {
        firstCategory: null,
        secondCategory: null,
        thirdCategory: null,
      },
    ],
  });

  /*
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      originalFileNames: selectedFiles?.map((file) => file.name),
    }));
  }, [selectedFiles]); */

  /*
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      originalFileNames: selectedFiles?.map((file) => file.name),
    }));
  }, [selectedFiles]); */

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      originalFileNames: selectedFiles.map((file) => file.name),
    }));
  }, [selectedFiles]);

  const handleImagesChange = (files) => {
    setSelectedFiles(files); //파일 저장
    //console.log("부모로 들어온", files);
    setImageFiles(files.filter((file) => file.type.startsWith("image")));
    setVideoFiles(files.filter((file) => file.type.startsWith("video/")));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (postData) => {
      //1. 백엔드에서 presigned-url 받아오기 위해 텍스트관련된 내용 먼저 보내기
      const cleanedCategories = filterEmptyCategories(formData.categoryDtos);
      if (cleanedCategories.length === 0) {
        alert("최소 1개 이상의 카테고리를 선택해주세요.");
        return;
      }
      const finalData = {
        ...formData,
        categoryDtos: cleanedCategories,
      };
      if (!formData.topic.trim()) {
        alert("제목을 입력해주세요.");
        return;
      }

      if (!formData.content.trim()) {
        alert("내용을 입력해주세요.");
        return;
      }

      if (!hasNewMedia && !hasExistingMedia) {
        alert("이미지 또는 영상을 1개 이상 첨부해주세요.");
        return;
      }

      return postFeed(finalData);
    },
    onSuccess: async (response) => {
      const { feedId, dtoList, videoResDto } = response.result;

      const chunkSize = 10 * 1024 * 1024;
      const chunkCount = Math.ceil(videoFiles[0]?.size / chunkSize);
      let getSignedUrlRes = "";
      let multiUploadArray = [];

      try {
        // 1. 이미지 업로드
        if (imageFiles.length > 0 && dtoList?.length > 0) {
          await Promise.all(
            dtoList.map(({ presignedUrl }, i) =>
              uploadToS3(presignedUrl, imageFiles[i])
            )
          );
        }

        // 2. 비디오 업로드
        if (videoFiles.length > 0 && videoResDto) {
          for (let uploadCount = 1; uploadCount <= chunkCount; uploadCount++) {
            const start = (uploadCount - 1) * chunkSize;
            const end = uploadCount * chunkSize;
            const fileBlob =
              uploadCount < chunkCount
                ? videoFiles[0].slice(start, end)
                : videoFiles[0].slice(start);

            const signedUrlRes = await postVideoSignedUrl({
              uploadId: videoResDto.uploadId,
              partNumber: uploadCount,
              fileName: videoResDto.fileName,
            });

            const presignedUrl = signedUrlRes?.result?.presignedUrl;
            const uploadChunk = await uploadToS3Video(presignedUrl, fileBlob);

            const etag = uploadChunk.headers.get("ETag")?.replaceAll("\\", "");
            multiUploadArray.push({
              awsETag: etag,
              partNumber: uploadCount,
            });

            // 마지막 part만 URL 저장
            if (uploadCount === chunkCount) {
              getSignedUrlRes = signedUrlRes;
            }
          }

          await postVideoUpload({
            uploadId: videoResDto.uploadId,
            fileName: videoResDto.fileName,
            parts: multiUploadArray,
          });
        }

        // 3. 최종 file 정보 구성
        const fileUrls = [];
        const fileNames = [];
        const fileTypes = [];

        if (imageFiles.length > 0) {
          fileUrls.push(...dtoList.map(({ fileUrl }) => fileUrl));
          fileNames.push(...imageFiles.map((file) => file.name));
          fileTypes.push(
            ...imageFiles.map((file) => file.type.split("/")[1].toUpperCase())
          );
        }

        if (videoFiles.length > 0 && getSignedUrlRes?.result?.fileUrl) {
          fileUrls.push(getSignedUrlRes.result.fileUrl);
          fileNames.push(videoFiles[0].name);
          fileTypes.push(videoFiles[0].type.split("/")[1].toUpperCase());
        }

        // 4. 통합 올림 서버에
        if (fileUrls.length > 0) {
          await postMedia({
            feedId,
            fileUrl: fileUrls,
            fileName: fileNames,
            fileType: fileTypes,
          });
        }

        setIsModal(true);
      } catch (error) {
        console.error("파일 업로드 또는 미디어 등록 중 에러:", error);
        alert("업로드 중 오류가 발생했습니다.");
      }
    },
  }); 

  const handleInputChange = (name, e) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (index) => (categoryData) => {
    setFormData((prev) => {
      const updatedCategories = prev.categoryDtos.map((cat, i) =>
        i === index ? categoryData : cat
      );
      return {
        ...prev,
        categoryDtos: updatedCategories,
      };
    });
  };

  return (
    <div className="max-w-[1000px] mx-auto my-10">
      <div className="w-[1000px] border-2 flex flex-col justify-center items-left p-10 gap-4">
        <div className="text-center font-bold text-3xl">게시물 작성</div>
        <PostInput
          title="제목"
          value={formData.topic}
          onChange={(e) => handleInputChange("topic", e)}
        />
        <PostInput
          title="내용"
          inputHeight="h-36"
          value={formData.content}
          onChange={(e) => handleInputChange("content", e)}
        />
        <div className="flex flex-col gap-2 w-full">
          <label className="block text-xl font-semibold text-gray-700 mb-2">
            카테고리
          </label>
          <div className="flex gap-2 w-full">
            {formData?.categoryDtos?.map((category, index) => (
              <CategorySelectBox
                key={index}
                title=""
                content=""
                defaultValue={category}
                type="text"
                isEditing={true}
                onChange={handleCategoryChange(index)}
                width="w-full"
              />
            ))}
          </div>
        </div>
        <ImageUpload onImagesChange={handleImagesChange} />
        <div className="flex gap-4 items-center justify-center">
          <button
            onClick={() => mutate(formData)}
            className="px-6 py-3 bg-yellow-main text-black rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200"
          >
            업로드
          </button>
          <button
            type="button"
            onClick={() => navigate("/recruit?category=1")}
            className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors duration-200"
          >
            취소
          </button>
        </div>
        {isModal && (
          <AlertModal
            type="simple"
            title="게시글 작성이 완료되었습니다."
            TrueBtnText="확인"
            onClickTrue={() => navigate("/recruit?category=1")}
          />
        )}
      </div>
    </div>
  );
}
