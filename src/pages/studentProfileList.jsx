import { useState, useEffect } from "react";
import Profile from "../components/studentProfile/profile";
import Pagination from "../components/pagination";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/profile";

export default function StudentProfileList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedProfiles, setDisplayedProfiles] = useState([]);
  const [userData,setUserData] = useState([]); 
  const pageSize = 6;

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  /*
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
    {
      id: 7,
      profileImg: "https://placehold.co/100",
      temperature: "85",
      hashtag: ["#React", "#Frontend", "#UXUI"],
      userName: "김시은",
      userDetail: "사용자 중심의 UI/UX를 설계하는 프론트엔드 개발자",
      userWorks: [
        "https://placehold.co/100x100?text=Work1",
        "https://placehold.co/100x100?text=Work2",
        "https://placehold.co/100x100?text=Work3",
      ],
    },
    {
      id: 8,
      profileImg: "https://placehold.co/100",
      temperature: "92",
      hashtag: ["#AI", "#Python", "#ML"],
      userName: "이시영",
      userDetail: "머신러닝 기반 서비스 개발 경험 보유",
      userWorks: [
        "https://placehold.co/100x100?text=ML1",
        "https://placehold.co/100x100?text=ML2",
      ],
    },
    {
      id: 9,
      profileImg: "https://placehold.co/100",
      temperature: "박정곤",
      hashtag: ["#Backend", "#Node.js"],
      userName: "김지훈",
      userDetail: "빠르고 안정적인 서버 구축을 지향합니다",
      userWorks: ["https://placehold.co/100x100?text=Server1"],
    },
    {
      id: 10,
      profileImg: "https://placehold.co/100",
      temperature: "88",
      hashtag: ["#Data", "#SQL", "#Visualization"],
      userName: "배성현",
      userDetail: "데이터로 문제를 해결하는 분석가",
      userWorks: [
        "https://placehold.co/100x100?text=Chart1",
        "https://placehold.co/100x100?text=Chart2",
        "https://placehold.co/100x100?text=Chart3",
      ],
    },
    {
      id: 11,
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
      id: 12,
      profileImg: "https://placehold.co/100",
      temperature: "82",
      hashtag: ["#Startup", "#PM", "#Strategy"],
      userName: "정다혜",
      userDetail: "기획과 전략으로 서비스를 이끄는 PM",
      userWorks: ["https://placehold.co/100x100?text=Plan1"],
    },
  ];*/

  //여기나중에 currentPage로 바꾸기
  const pageable = {
    page: 0,
    size: 12,
  };
  const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", pageable],
    queryFn: async () => {
      const data = await getProfile(categoryParam, pageable);
      console.log("getProfile 결과:", data);
      setUserData(data.result.content);
      return data;
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    setTotalPages(Math.ceil(userData.length / pageSize));

    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedProfiles(userData.slice(startIndex, endIndex));
  }, [currentPage, userData.length]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[20px] w-full">
        {displayedProfiles && displayedProfiles.map((data) => (
          <Profile
            key={data.id}
            profileId={data.memberId}
            profileImg={data.profileImgUrl}
            temperature={data.temperature}
            userName={data.nickname}
            userDetail={data.userDetail}
            userWorks={data.userWorks}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
