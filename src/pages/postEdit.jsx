import Button from "../components/button";
import Hashtag from "../components/post/hashtag";
import ImageUpload from "../components/post/imageUpload";
import PostInput from "../components/postInput";

export default function PostEdit() {
  return (
    <div className="max-w-4xl mx-auto my-10">
      <div className="w-[1000px] border-2 flex flex-col justify-center items-left p-10 gap-4">
        <div className="text-center font-bold text-4xl">게시물 수정</div>
        <PostInput title="주제" />
        <PostInput title="내용" inputHeight="h-36" />
        <Hashtag />
        <ImageUpload />
        <div className="flex flex-row px-52 gap-6">
          <Button btnText="수정 완료" />
          <button className="w-full h-[52px] px-6 mt-2 whitespace-nowrap rounded-[10px] text-black text-xl font-semibold border">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
