import fs from "fs";
import { SitemapStream, streamToPromise } from "sitemap";
import axios from "axios";

const BASE_URL = "https://ec3yu3zhsa.execute-api.ap-northeast-2.amazonaws.com/dev";

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

  smStream.end();
  const sitemap = await streamToPromise(smStream).then(sm => sm.toString());
  fs.writeFileSync("./public/sitemap.xml", sitemap);
})();





  /*
  // 동적 라우트 예시: recruitDetails
  const recruits = await fetch("https://api.souf.co.kr/recruits").then(res => res.json());
  recruits.forEach(r =>
    smStream.write({ url: `/recruitDetails/${r.id}`, changefreq: "weekly", priority: 0.8 })
  );

  // 동적 라우트 예시: profileDetail
  const profiles = await fetch("https://api.souf.co.kr/profiles").then(res => res.json());
  profiles.forEach(p =>
    smStream.write({ url: `/profileDetail/${p.id}`, changefreq: "weekly", priority: 0.7 })
  );*/