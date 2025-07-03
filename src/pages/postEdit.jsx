// PostEdit.js
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Button from "../components/button";
import PostInput from "../components/postInput";
import ImageUpload from "../components/post/imageUpload";
import CategorySelectBox from "../components/categorySelectBox";
import { updateFeed, uploadToS3, postMedia } from "../api/feed";

export default function PostEdit() {
  const navigate = useNavigate();
  const { id, worksId } = useParams();
  const location = useLocation();
  const { worksData, mediaData } = location.state || {};

  const [existingImages, setExistingImages] = useState([]); // 기존 이미지
  const [newImages, setNewImages] = useState([]); // 새로 추가된 이미지들

  const [formData, setFormData] = useState({
    topic: worksData?.topic || "",
    content: worksData?.content || "",
    categoryDtos: worksData?.categoryDtos || [
      { firstCategory: null, secondCategory: null, thirdCategory: null },
      { firstCategory: null, secondCategory: null, thirdCategory: null },
      { firstCategory: null, secondCategory: null, thirdCategory: null },
    ],
  });


  useEffect(() => {
    console.log(mediaData);
    if (mediaData?.length) {
      const formatted = mediaData.map((img) => ({
        ...img,
        preview: `https://iamsouf-bucket.s3.ap-northeast-2.amazonaws.com/${img.fileUrl}`,
      }));
      setExistingImages(formatted);
    }
    console.log("존재하는",existingImages);
  }, [mediaData]);
  

const handleImagesChange = (images) => {
  // 새 이미지: File 인스턴스
  const onlyNewImages = images.filter((img) => img instanceof File);
  const remainingExisting = images.filter((img) => !(img instanceof File));
  //setExistingImages();

  /*
  console.log("넘겨받는 데이터" , images);
  console.log("existing" , existingImages);
  // 기존 이미지: preview 속성 있는 일반 객체
  const remainingExisting = existingImages.filter((existing) =>
    images.some((img) => !(img instanceof File) && img.preview === existing.preview)
  );

  console.log("새 이미지만:", onlyNewImages);
  console.log("삭제 안 된 기존 이미지만:", remainingExisting);

  */
  setNewImages(onlyNewImages);
  setExistingImages(remainingExisting);
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

  const { mutate } = useMutation({
    mutationFn: (updateData) => updateFeed(worksData.feedId, updateData),
    onSuccess: async (response) => {
      const { feedId, dtoList } = response.result;

      try {
        // 1. 새 이미지 S3 업로드
        await Promise.all(
          dtoList.map(({ presignedUrl }, i) =>
            uploadToS3(presignedUrl, newImages[i])
          )
        );

        // 2. 미디어 등록
        await postMedia({
          feedId,
          fileUrl: dtoList.map((d) => d.fileUrl),
          fileName: newImages.map((f) => f.name),
          fileType: newImages.map((f) => f.type?.split("/")[1].toUpperCase()),
        });

        alert("수정이 완료되었습니다.");
        navigate("/");
      } catch (err) {
        console.error("업로드 실패:", err);
        alert("수정 실패");
      }
    },
  });

  const handleSubmit = () => {
    mutate({
    ...formData,
    existingImageUrls: existingImages.map((img) => {
      // 'https://iamsouf-bucket.s3.ap-northeast-2.amazonaws.com/feed/original/aaa.png'
      // → 'feed/original/aaa.png' 만 추출
      //const url = new URL(img.preview);
      return img.fileUrl; // '/feed/original/...' → 'feed/original/...'
    }),
    originalFileNames: newImages.map((f) => f.name),
  });
  };

  return (
    <div className="max-w-4xl mx-auto my-10">
      <div className="w-[1000px] border-2 flex flex-col justify-center items-left p-10 gap-4">
        <div className="text-center font-bold text-4xl">게시물 수정</div>

        <PostInput title="주제" value={formData.topic} onChange={(e) => handleInputChange("topic", e)} />
        <PostInput title="내용" inputHeight="h-36" value={formData.content} onChange={(e) => handleInputChange("content", e)}
          maxLength={300}/>

        <div className="flex gap-2 w-full">
          {formData.categoryDtos.map((category, index) => (
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

        <div className="flex flex-row px-52 gap-6">
          <Button btnText="수정 완료" onClick={handleSubmit} />
          <button
            className="w-full h-[52px] px-6 mt-2 whitespace-nowrap rounded-[10px] text-black text-xl font-semibold border"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
