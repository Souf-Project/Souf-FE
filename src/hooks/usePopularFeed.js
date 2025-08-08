import { useQuery } from "@tanstack/react-query";
//import { getPopularFeed } from './api';
import { useRef } from "react";
import { getPopularFeed } from "../api/feed";

export const usePopularFeed = (pageable) => {
  const lastValidDataRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["popularFeed", pageable],
    queryFn: async () => {
      const result = await getPopularFeed(pageable);
      return result;
    },
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
    staleTime: 1000 * 60, // 1분 동안 stale 아님
    refetchOnWindowFocus: false,
  });
  return { data, isLoading, error };
};
