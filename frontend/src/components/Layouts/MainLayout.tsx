import { FC, ReactNode } from 'react';
import Head from '@Components/generic/Head';

export type MainLayoutProps = {
  title: string;
  description: string;
  url: string;
  children: ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({
  title,
  description,
  url,
  children,
}) => (
  <>
    <Head title={title} description={description} url={url} />

    <div className="w-11/12 container mx-auto py-5">{children}</div>
  </>
);

export default MainLayout;
