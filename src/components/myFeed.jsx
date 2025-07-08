import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import backArrow from "../assets/images/backArrow.svg";
import BasicImg4 from "../assets/images/BasicprofileImg4.png";
import { getMemberFeed } from "../api/feed";
import { UserStore } from "../store/userStore";

export default function MyFeed() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [userWorks, setUserWorks] = useState([]);
  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;
  const {memberId} = UserStore();

  const { isLoading, error } = useQuery({
    queryKey: ["myFeed", memberId],
    queryFn: async () => {
      const data = await getMemberFeed(memberId);
      setUserData(data.result.memberResDto);
      setUserWorks(data.result.feedSimpleResDtoPage.content);
      return data;
    },
    keepPreviousData: true,
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const onWorkClick = (worksId) => {
    navigate(`/profileDetail/${userData.id}/post/${worksId}`);
  };

  return (
    <div className="flex flex-col px-4 max-w-4xl w-full">
        <div className="flex gap-12 mb-6 pl-6">
          <img
            src={
              userData?.profileUrl
                ? S3_BUCKET_URL + userData.profileUrl
                : BasicImg4
            }
            className="rounded-full w-1/4"
          />
          <div className="flex flex-col gap-2 mt-4 w-full">
            <div className="font-semibold text-[23px]">
              {userData?.nickname}
            </div>
            <div className="text-[#5B5B5B]">{userData?.intro}</div>
            <div className="text-[#5B5B5B]">{userData?.personalUrl}</div>
          </div>
        </div>

        <hr className="border-t border-gray-200 my-6" />

        <div className="grid grid-cols-3 justify-center w-full gap-1 cursor-pointer">
          {userWorks?.map((data) => (
            <div className="flex justify-center items-center h-[250px] overflow-hidden">
                <img
                    key={data.feedId}
                    src={S3_BUCKET_URL + data.mediaResDto?.fileUrl}
                    className="w-full h-full object-cover"
                    onClick={() => onWorkClick(data.feedId)}
                    alt="피드 이미지"
                />
            </div>

          ))}
        </div>
    </div>
  );
}
