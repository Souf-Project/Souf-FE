// components/SEO.js

import { useEffect } from "react";
import { Helmet } from "react-helmet-async";


export default function SEO({ title, subTitle ="", description }) {

    useEffect(() => {
    if (title) {
      document.title = `${title} | ${subTitle}`;
    }
  }, [title, subTitle]);
  return (
    <Helmet>
      <title>{title} | {subTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={`${title} | SouF`} />
      <meta property="og:description" content={description} />
       <meta charSet="utf-8" />
    </Helmet>
  );
}



