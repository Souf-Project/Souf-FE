// components/SEO.js

import { useEffect } from "react";
import { Helmet } from "react-helmet-async";


export default function SEO({ title, subTitle ="", description, content }) {

    useEffect(() => {
    if (title) {
      document.title = `${title} | ${subTitle}`;
    }
  }, [title, subTitle,content]);
  return (
    <Helmet>
      <title>{title} | {subTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={`${title} | SouF`} />
      <meta property="og:title" content={`${title} | SouF`} />
      <meta property="og:description" content={content} />
      <meta property="description" content={content} />
      <meta charSet="utf-8" />
    </Helmet>
  );
}



