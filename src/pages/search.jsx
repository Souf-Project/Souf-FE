import { useState } from "react";
import { useParams } from "react-router-dom";
import StudentProfileList from "./studentProfileList";
import StudentFeedList from "./studentFeedList";
import Pagination from "../components/pagination";
import RecruitBlock from "../components/recruitBlock";
import CategoryMenu from "../components/categoryMenu";

export default function Search() {
      const { keyword } = useParams();
      const [activeTab, setActiveTab] = useState("recruit");
      console.log(keyword);


    return (
       <div className="pt-16 px-6 w-4/5">
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center gap-4">
          <div className="flex">
            {["recruit", "profile", "feed"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-lg font-extrabold transition-colors duration-200 relative group ${
                  activeTab === tab ? "text-yellow-point" : "text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <span>
                  {tab === "recruit"
                    ? "기업 공고문"
                    : tab === "profile"
                    ? "대학생 프로필"
                    : "대학생 피드"}
                </span>
                <span
                  className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
                    activeTab === tab ? "w-3/4" : "w-0 group-hover:w-3/4"
                  }`}
                ></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-row">
        {activeTab === "recruit" ? (
          <div className="w-3/4 mx-auto">
            {/* {filteredRecruits.length > 0 ? (
              <>
                {filteredRecruits.map((recruit) => (
                  <RecruitBlock
                    key={recruit.recruitId}
                    id={recruit.recruitId}
                    title={recruit.title}
                    content={recruit.content}
                    deadLine={recruit.deadLine}
                    payment={recruit.payment}
                    recruitCount={recruit.recruitCount}
                    region={recruit.region}
                    secondCategory={recruit.secondCategory}
                  />
                ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  선택한 카테고리의 공고가 없습니다.
                </p>
              </div>
            )} */}
          </div>
        ) : activeTab === "profile" ? (
          <div className="bg-white rounded-lg shadow-sm p-6 w-3/4 mx-auto">
            <StudentProfileList />
          </div>
        ) : (
          <div className="w-3/4 mx-auto">
            <StudentFeedList />
          </div>
        )}
      </div>
    </div>
    )
}