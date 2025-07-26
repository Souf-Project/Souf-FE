// components/SEO.js
import { Helmet } from "react-helmet";

export default function SEO({ title, subTitle ="", description }) {
  return (
    <Helmet>
      <title>{title} | {subTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={`${title} | SouF`} />
      <meta property="og:description" content={description} />
    </Helmet>
  );
}
