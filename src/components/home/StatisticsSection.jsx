import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import useCountUp from "../../hooks/useCountUp";


export default function StatisticsSection({ viewCount, userCount, recruitCount }) {
  // useCountUp 훅을 사용하여 애니메이션 카운트 생성
  const animatedViewCount = useCountUp(viewCount, 2000);
  const animatedUserCount = useCountUp(userCount, 2000);
  const animatedRecruitCount = useCountUp(recruitCount, 2000);
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-around items-center w-full bg-[#FFFBE5] py-8 lg:h-64 mt-20 shadow-md px-4 lg:px-0">
      <div className="flex flex-col justify-center gap-2 text-center lg:text-left">
        <div className="text-2xl sm:text-5xl lg:text-6xl font-bold">{dayjs().format('YYYY.MM.DD')}</div>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 ml-auto items-center">
          <div className="text-sm sm:text-3xl lg:text-5xl font-bold text-center sm:text-left">오늘 스프 사이트 조회수: </div>
          <div className="text-sm sm:text-3xl lg:text-5xl font-bold">
            {animatedViewCount.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col justify-center gap-4 lg:gap-2 text-center lg:text-left">
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 ml-auto items-center">
          <div className="text-sm sm:text-3xl lg:text-5xl font-bold">대학생 프리랜서 가입자: </div>
          <div className="text-sm sm:text-3xl lg:text-5xl font-bold">
            {animatedUserCount.toLocaleString()}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 ml-auto items-center">
          <div className="text-sm sm:text-3xl lg:text-5xl font-bold">등록된 기업 공고문: </div>
          <div className="text-sm sm:text-3xl lg:text-5xl font-bold">
            {animatedRecruitCount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
} 