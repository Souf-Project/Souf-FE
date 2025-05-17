import { useNavigate } from "react-router-dom";

export default function RecruitPostBlock({ posts, onClickApplicants }) {
  const navigate = useNavigate();
  //
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-t border-gray-200">
        <thead className="text-gray-600 text-left border-b">
          <tr className="bg-[#EBEBEB]">
            <th className="py-2 px-4">공고문 제목</th>
            <th className="py-2 px-4">공고 마감일</th>
            <th className="py-2 px-4">카테고리</th>
            <th className="py-2 px-4">진행 상태</th>
            <th className="py-2 px-4 ">지원자 확인</th>
            <th className="py-2 px-4">상세보기</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{post.title}</td>
              <td className="py-3 px-4">{post.deadline}</td>
              <td className="py-3 px-4">
                {post.category.map((cat, i) => (
                  <div key={i}>{cat}</div>
                ))}
              </td>
              <td className="py-3 px-4">{post.progress}</td>
              <td
                className="py-3 px-4 cursor-pointer"
                onClick={() => onClickApplicants()}
              >
                {post.applicants}명
              </td>
              <td className="py-3 px-4 text-center cursor-pointer">🔍</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
