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

export default function PostUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isModal , setIsModal] = useState(false);
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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      originalFileNames: selectedFiles.map((file) => file.name),
    }));
  }, [selectedFiles]);

  const handleImagesChange = (files) => {
    setSelectedFiles(files); //파일 저장
  };
  

  /*
  카테고리 3개 아니면 null인 거 없애고 null 아닌 것만 보내는 그런 거 지금 아무것도 추가 안되어있어서
  나중에 추가해야대 ... 
  */
  const { mutate, isPending } = useMutation({
    mutationFn: (postData) => {
      //1. 백엔드에서 presigned-url 받아오기 위해 텍스트관련된 내용 먼저 보내기
      return postFeed(postData);
    },
    onSuccess: async (response) => {
      const { feedId, dtoList, videoResDto} = response.result; // 위에 mutationFn 로 받은 결과중에 미디어파일관련된 것만 받아옴
      
      /*
      const chunkSize = 10*1024*1024;
      const chunkCount = Math.floor(/chunkSize) + 1;
      */
      try {
        // 2. AWS s3 에 모두 업로드함
        await Promise.all(
          dtoList.map(({ presignedUrl }, i) =>
            uploadToS3(presignedUrl, selectedFiles[i])
          )
        );  

        //이건 각각 파일 여러개면 list로 만들어야해서 코드 추가함
        const fileUrls = dtoList.map(({ fileUrl }) => fileUrl);
        const fileNames = selectedFiles.map((file) => file.name);
        const fileTypes = selectedFiles.map((file) =>
          file.type.split("/")[1].toUpperCase()
        );

        //3. s3에 업로드 성공 후 미디어파일관련 백엔드에 보내주기
        await postMedia({
          feedId,
          fileUrl: fileUrls,
          fileName: fileNames,
          fileType: fileTypes,
        });
        //여기는 추후에 파일 전송완료되면 실행시킬 코드 추가 ..
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
    console.log(formData);
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
              width='w-full'
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
            onClick={() => navigate('/recruit?category=1')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors duration-200"
          >
            취소
          </button>
        </div>
        {isModal &&  <AlertModal type="simple" title="게시글 작성이 완료되었습니다." TrueBtnText="확인" onClickTrue={() => navigate("/recruit?category=1")}/>}
       </div>
    </div>
  );
}
