import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecruitPostBlock from "./recruitPostBlock";
import StateBlock from "./stateBlock";
import Profile from "../studentProfile/profile";

export default function RecruitPostList() {
  const [step, setStep] = useState(1);
  const posts = [
    {
      title: "디지털 광고 컨셉 그래픽 디자이너",
      deadline: "2025.04.01",
      category: ["시각 예술", "제품 홍보 사진"],
      progress: "마감",
      applicants: 1,
    },
    {
      title: "디지털 광고 컨셉 그래픽 디자이너",
      deadline: "상시모집",
      category: ["시각 예술", "제품 홍보 사진"],
      progress: "모집 중",
      applicants: 1,
    },
  ];

  const post = [
    {
      title: "디지털 광고 컨셉 그래픽 디자이너",
      deadline: "2025.04.01",
      category: ["시각 예술", "제품 홍보 사진"],
      progress: "마감",
      applicants: 1,
    },
  ];

  const userData = [
    {
      id: 1,
      profileImg: "https://placehold.co/100",
      temperature: "85",
      hashtag: ["#React", "#Frontend", "#UXUI"],
      userName: "홍길동",
      userDetail: "사용자 중심의 UI/UX를 설계하는 프론트엔드 개발자",
      userWorks: [
        "https://placehold.co/100x100?text=Work1",
        "https://placehold.co/100x100?text=Work2",
        "https://placehold.co/100x100?text=Work3",
      ],
    },
    {
      id: 2,
      profileImg: "https://placehold.co/100",
      temperature: "92",
      hashtag: ["#AI", "#Python", "#ML"],
      userName: "이서연",
      userDetail: "머신러닝 기반 서비스 개발 경험 보유",
      userWorks: [
        "https://placehold.co/100x100?text=ML1",
        "https://placehold.co/100x100?text=ML2",
      ],
    },
    {
      id: 3,
      profileImg: "https://placehold.co/100",
      temperature: "78",
      hashtag: ["#Backend", "#Node.js"],
      userName: "김지훈",
      userDetail: "빠르고 안정적인 서버 구축을 지향합니다",
      userWorks: ["https://placehold.co/100x100?text=Server1"],
    },
    {
      id: 4,
      profileImg: "https://placehold.co/100",
      temperature: "88",
      hashtag: ["#Data", "#SQL", "#Visualization"],
      userName: "최은지",
      userDetail: "데이터로 문제를 해결하는 분석가",
      userWorks: [
        "https://placehold.co/100x100?text=Chart1",
        "https://placehold.co/100x100?text=Chart2",
        "https://placehold.co/100x100?text=Chart3",
      ],
    },
    {
      id: 5,
      profileImg: "https://placehold.co/100",
      temperature: "90",
      hashtag: ["#App", "#Flutter"],
      userName: "박찬호",
      userDetail: "모바일 환경에 최적화된 앱 개발을 지향",
      userWorks: [
        "https://placehold.co/100x100?text=App1",
        "https://placehold.co/100x100?text=App2",
      ],
    },
    {
      id: 6,
      profileImg: "https://placehold.co/100",
      temperature: "82",
      hashtag: ["#Startup", "#PM", "#Strategy"],
      userName: "정다혜",
      userDetail: "기획과 전략으로 서비스를 이끄는 PM",
      userWorks: ["https://placehold.co/100x100?text=Plan1"],
    },
  ];

  const navigate = useNavigate();
  const onClickApplicants = () => {
    //navigate("/company/applicants");
    setStep(2);
  };

  /*
  {["상시모집", "모집중"].map((label, idx) => (
          <button
            key={label}
            className="bg- text-lg font-medium px-10 py-1 rounded-[10px] w-full h-[60px] flex items-center justify-between"
          >
            <span>{label}</span>
            <span className="mx-3 h-6 border-l border-[#898989]"></span>
            <span className="font-bold">5</span>
          </button>
        ))}
        <button className="bg-[#FFE58F] text-lg font-medium px-10 py-1 rounded-[10px] w-full h-[60px] flex items-center justify-between">
          <span>모집완료</span>
          <span className="mx-3 h-6 border-l border-[#898989]"></span>
          <span className="font-bold">5</span>
        </button>
  
  */
  return (
    <div className="bg-white p-6 rounded-lg">
      {step === 1 ? (
        <>
          <h1 className="text-[32px] font-semibold mb-6">공고문 내역</h1>
          <div className="flex space-x-48 mb-4">
            <StateBlock color="bg-[#FFEFBA]" label="상시모집" value="5" />
            <StateBlock color="bg-[#FFEFBA]" label="모집중" value="5" />
            <StateBlock color="bg-[#FFE58F]" label="모집완료" value="5" />
          </div>
          <RecruitPostBlock
            posts={posts}
            onClickApplicants={onClickApplicants}
          />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 pr-4">
            <h1 className="text-[32px] font-semibold mb-6">지원자 내역</h1>
            <StateBlock color="bg-[#FFE58F]" label="지원자 수" value="5" />
          </div>

          <RecruitPostBlock
            posts={post}
            onClickApplicants={onClickApplicants}
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full">
            {userData.map((data) => (
              <Profile
                profileId={data.id}
                profileImg={data.profileImg}
                temperature={data.temperature}
                hashtag={data.hashtag}
                userName={data.userName}
                userDetail={data.userDetail}
                userWorks={data.userWorks}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
