import { FC } from 'react';
import NextHead from 'next/head';

export type HeadProps = {
  title: string;
  description: string;
  url: string;
  noindex?: boolean;
};

const Head: FC<HeadProps> = ({ title, description, url, noindex = false }) => (
  <NextHead>
    <title>{title} | ShareRecipes</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || '' + url} />
    {noindex && <meta name="robots" content="noindex" />}

    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;400;700&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="theme-color" content="#ffffff" />
  </NextHead>
);

export default Head;
