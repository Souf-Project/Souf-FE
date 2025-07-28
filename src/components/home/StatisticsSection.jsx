import React from "react";
import dayjs from "dayjs";
import AnimatedCount from "../AnimatedCount";

export default function StatisticsSection({ viewCount, prevViewCount, userCount, prevUserCount, recruitCount, prevRecruitCount }) {
  return (
    <div className="flex gap-10 justify-around items-center w-full bg-[#FFFBE5] h-52 mt-20 shadow-md">
      <div className="flex flex-col justify-center gap-2">
        <div className="lg:text-6xl text-4xl font-bold">{dayjs().format('YYYY.MM.DD')}</div>
        <div className="flex gap-2 items-center">
          <div className="lg:text-5xl text-3xl font-bold">오늘 스프 사이트 조회수: </div>
          <div className="lg:text-5xl text-3xl font-bold">
            <AnimatedCount value={viewCount} prevValue={prevViewCount} />
          </div>
        </div>
       
      </div>
      <div className="flex flex-col justify-center gap-2">
      <div className="flex gap-2 items-center">
          <div className="lg:text-5xl text-3xl font-bold">대학생 프리랜서 가입자: </div>
          <div className="lg:text-5xl text-3xl font-bold">
            <AnimatedCount value={userCount} prevValue={prevUserCount} />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="lg:text-5xl text-3xl font-bold">등록된 기업 공고문: </div>
          <div className="lg:text-5xl text-3xl font-bold">
            <AnimatedCount value={recruitCount} prevValue={prevRecruitCount} />
          </div>
        </div>
      </div>
    </div>
  );
} 