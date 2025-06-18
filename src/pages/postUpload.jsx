import { useMutation } from "@tanstack/react-query";
import Button from "../components/button";
import Hashtag from "../components/post/hashtag";
import ImageUpload from "../components/post/imageUpload";
import PostInput from "../components/postInput";
import { postFeed, postMedia, uploadToS3 } from "../api/feed";
import { useState } from "react";
import CategorySelectBox from "../components/categorySelectBox";

export default function PostUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    topic: "",
    content: "",
    //tags: "[봄, 산책, 나들이]",
    originalFileNames: selectedFiles.map((file) => file.name),
    categoryDtos: [],
  });

  const handleImagesChange = (files) => {
    setSelectedFiles(files); // 🔹 File[]을 상태로 저장
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (postData) => postFeed(postData),
    onSuccess: async ({ feedId, dtoList }) => {
      try {
        // 1. S3에 모두 업로드
        await Promise.all(
          dtoList.map(({ presignedUrl }, i) =>
            uploadToS3(presignedUrl, selectedFiles[i])
          )
        );

        // 2. 업로드 후 서버에 메타데이터 전송
        /*
        {
  "postId": 1,
  "fileUrl": "https://iamsouf.s3.amazonaws.com/feed/original/example.jpg",
  "fileName": "[fileName, pictureName, spring, hihi]",
  "fileType": "[jpg, jpg, png, jpeg]"
}

        */
        await Promise.all(
          dtoList.map(({ fileUrl }, i) =>
            sendMetaData({
              feedId,
              fileUrl,
              fileName: imageFiles[i].name,
              fileType: imageFiles[i].type.split("/")[1], // 'jpg' 등
            })
          )
        );
      } catch (err) {
        console.error("업로드 실패:", err);
        alert("업로드 중 오류 발생");
      }
    },
    onError: () => {
      alert("게시물 생성 실패");
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

  return (
    <div className="max-w-4xl mx-auto my-10">
      <div className="w-[1000px] border-2 flex flex-col justify-center items-left p-10 gap-4">
        <div className="text-center font-bold text-4xl">게시물 업로드</div>
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
        />
        <CategorySelectBox />
        <ImageUpload onImagesChange={handleImagesChange} />
        <div className="flex flex-row px-52 gap-6">
          <Button btnText="업로드" onClick={() => mutate(postData)} />
          <button className="w-full h-[52px] px-6 mt-2 whitespace-nowrap rounded-[10px] text-black text-xl font-semibold border">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
