// generate-sitemap.js
const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const fetch = require("node-fetch");

(async () => {
  const smStream = new SitemapStream({ hostname: "https://www.souf.co.kr" });

  // 정적 라우트 추가
  const staticRoutes = [
    "/", "/login", "/join", "/mypage", "/recruit",
    "/students", "/contests", "/search"
  ];
  staticRoutes.forEach(url => smStream.write({ url }));

  // 동적 라우트 예시: recruitDetails
  const recruits = await fetch("https://api.souf.co.kr/recruits").then(res => res.json());
  recruits.forEach(r =>
    smStream.write({ url: `/recruitDetails/${r.id}`, changefreq: "weekly", priority: 0.8 })
  );

  // 동적 라우트 예시: profileDetail
  const profiles = await fetch("https://api.souf.co.kr/profiles").then(res => res.json());
  profiles.forEach(p =>
    smStream.write({ url: `/profileDetail/${p.id}`, changefreq: "weekly", priority: 0.7 })
  );

  // 동적 라우트 예시: contests
  const contests = await fetch("https://api.souf.co.kr/contests").then(res => res.json());
  contests.forEach(c =>
    smStream.write({ url: `/contests/${c.category}/${c.id}`, changefreq: "weekly", priority: 0.7 })
  );

  smStream.end();
  const sitemap = await streamToPromise(smStream).then(sm => sm.toString());
  fs.writeFileSync("./public/sitemap.xml", sitemap);
})();
