import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { getPopularRecruit } from "../api/recruit";

export const usePopularRecruit = (pageable) => {
  const lastValidDataRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["popularRecruit", pageable],
    queryFn: () => getPopularRecruit(pageable),
    keepPreviousData: true,
    select: (incomingData) => {
      if (incomingData === null) {
        // 304의 경우: 이전 데이터를 유지
        return lastValidDataRef.current;
      } else {
        // 새 데이터 수신 시: ref 업데이트
        lastValidDataRef.current = incomingData;
        return incomingData;
      }
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, error };
};
