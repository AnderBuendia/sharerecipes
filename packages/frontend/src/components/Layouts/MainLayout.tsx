import type { FC, ReactNode } from 'react';
import Head from '@Components/generic/Head';

export type MainLayoutProps = {
  title: string;
  description: string;
  url: string;
  image?: string;
  children: ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({
  title,
  description,
  url,
  image,
  children,
}) => (
  <>
    <Head title={title} description={description} image={image} url={url} />

    <div className="w-10/12 container m-auto py-5">{children}</div>
  </>
);

export default MainLayout;
