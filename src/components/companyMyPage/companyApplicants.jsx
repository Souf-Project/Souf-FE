import RecruitPostBlock from "./recruitPostBlock";

export default function CompanyApplicants() {
  const posts = [
    {
      title: "디지털 광고 컨셉 그래픽 디자이너",
      deadline: "2025.04.01",
      category: ["시각 예술", "제품 홍보 사진"],
      progress: "마감",
      applicants: 1,
    },
  ];
  return <div>{RecruitPostBlock(posts)}</div>;
}
