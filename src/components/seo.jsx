import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

export default function SEO({ title, subTitle = "", description, content }) {

  const location = useLocation();
  const url = `https://www.souf.co.kr${location.pathname}`;

  const safeTitle = title || "SouF";
  const safeSubTitle = subTitle || "대학생 외주";

  useEffect(() => {
    document.title = `${safeTitle} | ${safeSubTitle}`;
  }, [safeTitle, safeSubTitle]);

  return (
    <Helmet>
      <title>{`${safeTitle} | ${safeSubTitle}`}</title>

      <link rel="canonical" href={url} />

      <meta name="description" content={content || description || "스프 SouF 대학생 외주"} />

      <meta property="og:title" content={`${safeTitle} | SouF`} />
      <meta property="og:description" content={content || description || "스프 SouF 대학생 외주"} />
      <meta property="og:url" content={url} />

      <meta charSet="utf-8" />
    </Helmet>
  );
}