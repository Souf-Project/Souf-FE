import fs from "fs";
import { SitemapStream, streamToPromise } from "sitemap";
import axios from "axios";

const BASE_URL = "https://ec3yu3zhsa.execute-api.ap-northeast-2.amazonaws.com/dev";
const API_BASE_URL = process.env.VITE_BASE_URL || "https://ec3yu3zhsa.execute-api.ap-northeast-2.amazonaws.com/dev";

async function fetchAllContestsByType(type) {
  const allItems = [];
  let page = 0;
  const size = 100;

  while (true) {
    try {
      const response = await axios.get(`${BASE_URL}/contests`, {
        params: { type, page, size },
      });
      const data = response.data;

      const contests = Array.isArray(data.data) ? data.data : [];
      if (contests.length === 0) break;

      allItems.push(...contests);

      if (contests.length < size) break;
      page++;
    } catch (error) {
      console.error(`컨테스트 조회 에러 (type: ${type}, page: ${page}):`, error);
      break;
    }
  }

  return allItems;
}

// 모든 피드 가져오기
async function fetchAllFeeds() {
  const allFeeds = [];
  let page = 0;
  const size = 100;

  while (true) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/feed`, {
        params: {
          page,
          size,
        },
      });
      const data = response.data;

      const feeds = data?.result?.content || [];
      if (feeds.length === 0) break;

      allFeeds.push(...feeds);

      if (feeds.length < size) break;
      page++;
    } catch (error) {
      console.error(`피드 조회 에러 (page: ${page}):`, error.message);
      break;
    }
  }

  return allFeeds;
}

// 모든 공고문 가져오기
async function fetchAllRecruits() {
  const allRecruits = [];
  let page = 0;
  const size = 100;

  while (true) {
    try {
      // getRecruit 함수와 동일한 요청 바디 구조
      const requestBody = {
        title: null,
        content: null,
        categories: null,
        sortOption: {
          sortKey: "RECENT",
          sortDir: "DESC",
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/recruit/search`,
        requestBody,
        {
          params: {
            page,
            size,
          },
        }
      );

      // getRecruit 함수는 response를 반환하므로 response.data가 실제 데이터
      const data = response.data;
      const recruits = data?.result?.content || [];

      if (recruits.length === 0) break;

      allRecruits.push(...recruits);

      if (recruits.length < size) break;
      page++;
    } catch (error) {
      console.error(`공고문 조회 에러 (page: ${page}):`, error.message);
      if (error.response) {
        console.error(`응답 상태: ${error.response.status}`, error.response.data);
      }
      break;
    }
  }

  return allRecruits;
}

(async () => {
  const smStream = new SitemapStream({ hostname: "https://www.souf.co.kr" });

   // 정적 라우트 추가
  const staticRoutes = [
    "/", "/login", "/join", "/mypage", "/recruit",
    "/students", "/contests", "/search"
  ];
  staticRoutes.forEach(url => smStream.write({ url }));

  // contests 타입별로 처리
  const contestTypes = ["rendering", "closed"];

  for (const type of contestTypes) {
    const contests = await fetchAllContestsByType(type);
    contests.forEach(c => {
      // React 코드에서 categoryID 배열의 첫 요소, 그리고 contestID가 URL 파라미터로 쓰임
      const category = Array.isArray(c.categoryID) && c.categoryID.length > 0 ? c.categoryID[0] : "unknown";
      const contestId = c.contestID || "unknown";

      smStream.write({
        url: `/contests/${category}/${contestId}`,
        changefreq: "weekly",
        priority: 0.7,
      });
    });
  }

  // 피드 URL 추가 (동적)
  console.log("피드 목록 가져오는 중...");
  try {
    const feeds = await fetchAllFeeds();
    console.log(`총 ${feeds.length}개의 피드를 찾았습니다.`);
    feeds.forEach(feed => {
      if (feed.feedId) {
        smStream.write({
          url: `/profileDetail/${feed.feedId}`,
          changefreq: "weekly",
          priority: 0.8,
        });
      }
    });
    console.log(`피드 URL ${feeds.filter(f => f.feedId).length}개를 sitemap에 추가했습니다.`);
  } catch (error) {
    console.error("피드 URL 생성 중 에러:", error.message);
    if (error.response) {
      console.error(`응답 상태: ${error.response.status}`, error.response.data);
    }
  }

  // 공고문 URL 추가 (동적) - 라우터 경로: /recruitDetails/:id
  console.log("공고문 목록 가져오는 중...");
  try {
    const recruits = await fetchAllRecruits();
    console.log(`총 ${recruits.length}개의 공고문을 찾았습니다.`);
    recruits.forEach(recruit => {
      if (recruit.recruitId) {
        smStream.write({
          url: `/recruitDetails/${recruit.recruitId}`,
          changefreq: "weekly",
          priority: 0.8,
        });
      }
    });
    console.log(`공고문 URL ${recruits.filter(r => r.recruitId).length}개를 sitemap에 추가했습니다.`);
  } catch (error) {
    console.error("공고문 URL 생성 중 에러:", error.message);
    if (error.response) {
      console.error(`응답 상태: ${error.response.status}`, error.response.data);
    }
  }

  smStream.end();
  const sitemap = await streamToPromise(smStream).then(sm => sm.toString());
  fs.writeFileSync("./public/sitemap.xml", sitemap);
  console.log("sitemap.xml 생성 완료!");
})();