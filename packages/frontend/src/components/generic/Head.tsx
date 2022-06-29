import type { FC } from 'react';
import NextHead from 'next/head';

const TWITTER_CREATOR = '@_SrAnder';
const SITE_LANGUAGE = 'en';
const SITE_AUTHOR = 'anderb';

export type HeadProps = {
  title: string;
  description: string;
  url: string;
  image?: string;
  noindex?: boolean;
};

const Head: FC<HeadProps> = ({
  title,
  description,
  url,
  image,
  noindex = false,
}) => {
  const facebookAppId = 't';
  const facebookPagesTagId = 'e';
  const facebookPagesId = 'a';
  const [, urlWithoutPage] = url.match(/((?:.+?)\/)(?:\d*\/)?$/) || [, url];

  return (
    <NextHead>
      <title>{title} | ShareRecipes</title>
      <meta name="lang" content={SITE_LANGUAGE} />
      <meta name="author" content={SITE_AUTHOR} />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={urlWithoutPage}/>
      <meta property="og:type" content="web" />
      <meta property="og:site_name" content="ShareRecipes" />
      <meta property="og:image" content={image} />
      
      {/* Twitter Card data */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={TWITTER_CREATOR} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:description" content={description} />
      
      {/* Facebook */}
      <meta property="fb:app_id" content={facebookAppId} />
      <meta property="fb:pages" content={facebookPagesId} />
      
      {/* Disable search engine indexing */}
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex' : 'index,follow'} />

      {/* Favicon */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="theme-color" content="#ffffff" />
    </NextHead>
  );
}

export default Head;
