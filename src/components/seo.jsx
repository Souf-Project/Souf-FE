// components/SEO.js

import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export default function SEO({ title, subTitle = "", description, content }) {
  // title과 subTitle이 유효한 문자열인지 확인
  const safeTitle = title || "SouF";
  const safeSubTitle = subTitle || "대학생 외주";

  useEffect(() => {
    document.title = `${safeTitle} | ${safeSubTitle}`;
  }, [safeTitle, safeSubTitle]);

  return (
    <Helmet>
      <title>{`${safeTitle} | ${safeSubTitle}`}</title>
      <meta property="title" content={`${safeTitle} | SouF`} />
      <meta property="description" content={content || description || "스프 SouF 대학생 외주"} />
      <meta property="og:title" content={`${safeTitle} | SouF`} />
      <meta property="og:description" content={content || description || "스프 SouF 대학생 외주"} />
      <meta charSet="utf-8" />
    </Helmet>
  );
}
