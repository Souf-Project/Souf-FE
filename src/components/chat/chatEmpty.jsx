import ChatEmptyMem from "../../assets/images/EmptyChatMem.svg";
import Button from "../button";
import { useNavigate } from "react-router-dom";

export default function ChatEmpty(position = "company") {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center w-full justify-center gap-4 ">
      <img src={ChatEmptyMem} />
      {position === "company" ? (
        <div className="flex flex-col items-center max-w-[400px] gap-2">
          <span className="text-2xl">회사에 적합한 인재를 찾아보세요!</span>
          <Button 
            btnText="대학생 프로필 보러가기" 
            width="w-[300px]" 
            onClick={() => navigate("/student-profile-list")}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center max-w-[400px] gap-2">
          <span className="text-2xl">나에게 맞는 공고를 찾아보세요!</span>
          <Button 
            btnText="기업 공고문 보러가기" 
            width="w-[300px]" 
            onClick={() => navigate("/recruit?category=1")}
          />
        </div>
      )}
    </div>
  );
}
