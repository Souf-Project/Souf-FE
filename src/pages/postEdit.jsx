// PostEdit.js
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Button from "../components/button";
import PostInput from "../components/postInput";
import ImageUpload from "../components/post/imageUpload";
import CategorySelectBox from "../components/categorySelectBox";
import { updateFeed, uploadToS3, postMedia } from "../api/feed";
import { postVideoSignedUrl, postVideoUpload, uploadToS3Video } from "../api/video";
import AlertModal from "../components/alertModal";

const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

export default function PostEdit() {
  const navigate = useNavigate();
  const [isModal , setIsModal] = useState(false);
  const { id, worksId } = useParams();
  const location = useLocation();
  const { worksData, mediaData } = location.state || {};

  const [existingImages, setExistingImages] = useState([]); // 기존 이미지
  const [newImages, setNewImages] = useState([]); // 새로 추가된 이미지들
  const [newVideo, setNewVideo] = useState();
  const [newFiles ,setNewFiles] = useState([]);

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
        preview: `${BUCKET_URL}${img.fileUrl}`,
      }));
      setExistingImages(formatted);
    }
  }, [mediaData]);
  

const handleImagesChange = (images) => {
  // 새 이미지: File 인스턴스
  const onlyNewImages = images.filter((img) => img instanceof File && img.type.startsWith("image"));
  const onlyNewVideo = images.find((img) => img instanceof File && img.type.startsWith("video/"));
  
  const remainingExisting = images.filter((img) => !(img instanceof File));
  const newFile = images.filter((img) => img instanceof File);
  //setExistingImages();

  setNewImages(onlyNewImages);
  setNewVideo(onlyNewVideo);

  setExistingImages(remainingExisting);
  setNewFiles(newFile);

};

useEffect( () => {
    console.log("파일 리스트" , newVideo);
  console.log("이미지 리스트" , newImages); 
},[newImages,newVideo])

  const handleExistingImageDelete = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);

    console.log("업데이트된거",updated);
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
      const { feedId, dtoList, videoResDto } = response.result;

      const chunkSize = 10*1024*1024;
      const chunkCount = Math.ceil(newVideo.size/chunkSize);
      console.log(chunkCount);
      let getSignedUrlRes = "";

      try {
        // 1. 새 이미지 S3 업로드
        await Promise.all(
          dtoList.map(({ presignedUrl }, i) =>
            uploadToS3(presignedUrl, newImages[i])
          )
        );

        let multiUploadArray = [];
        // 2-2. AWS s3 비디오 업로드함
        for(let uploadCount = 1 ; uploadCount < chunkCount+1 ; uploadCount++){
          let start = (uploadCount-1)*chunkSize;
          let end = uploadCount*chunkSize;
          let fileBob = uploadCount < chunkCount ? newVideo?.slice(start , end) : newVideo?.slice(start);

          getSignedUrlRes =  await postVideoSignedUrl({
             uploadId: videoResDto?.uploadId,
             partNumber: uploadCount,
             fileName : videoResDto.fileName,
            });
          let preSignedUrl = getSignedUrlRes?.result?.presignedUrl;

          let uploadChuck = await uploadToS3Video(preSignedUrl,fileBob);

          let EtagHeader = uploadChuck.headers.get('ETag').replaceAll('\\', '');
          let uploadPartDetails = {
            awsETag : EtagHeader,
            partNumber : uploadCount
          };
          //console.log("파일 확인",uploadPartDetails);
          multiUploadArray.push(uploadPartDetails);
        } 

        if(newVideo && newVideo instanceof File){
          await postVideoUpload({
            uploadId: videoResDto?.uploadId,
            fileName : videoResDto?.fileName,
            parts : multiUploadArray,
          })
        }

        const fileUrls = dtoList.map((d) => d.fileUrl);
        const fileNames = newImages.map((f) => f.name);
        const fileTypes = newImages.map((f) => f.type?.split("/")[1].toUpperCase());
        
        fileUrls.push(getSignedUrlRes?.result?.fileUrl);
        fileNames.push(newVideo?.name);
        fileTypes.push(newVideo?.type?.split("/")[1].toUpperCase());

        // 2. 미디어 등록
        await postMedia({
          feedId,
          fileUrl: fileUrls,
          fileName: fileNames,
          fileType: fileTypes,
        });

        setIsModal(true);
        //navigate("/");
      } catch (err) {
        console.error("업로드 실패:", err);
        alert("수정 실패");
      }
    },
  });

  const handleSubmit = () => {
    mutate({
    ...formData,
    existingImageUrls: existingImages?.map((img) => {
      // 'https://iamsouf-bucket.s3.ap-northeast-2.amazonaws.com/feed/original/aaa.png'
      // → 'feed/original/aaa.png' 만 추출
      //const url = new URL(img.preview);
      return img.fileUrl; // '/feed/original/...' → 'feed/original/...'
    }),
    originalFileNames: newFiles?.map((file) => file.name)
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
      {isModal &&  <AlertModal type="simple" title="게시글 작성이 완료되었습니다." TrueBtnText="확인" onClickTrue={() => navigate("/recruit?category=1")}/>}
    </div>
  );
}
