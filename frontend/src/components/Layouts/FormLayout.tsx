import { FC, ReactNode } from 'react';
import Link from 'next/link';
import Head from '@Components/generic/Head';
import { RamenIcon } from '@Components/Icons/ramen.icon';
import { MainPaths } from '@Enums/paths/main-paths.enum';

export type FormLayoutProps = {
  title: string;
  description: string;
  url: string;
  children: ReactNode;
};

const FormLayout: FC<FormLayoutProps> = ({
  title,
  description,
  url,
  children,
}) => (
  <>
    <Head title={title} description={description} url={url} />

    <div className="relative top-28 flex flex-col items-center justify-center">
      <Link href={MainPaths.INDEX}>
        <a>
          <RamenIcon w={70} h={70} />
        </a>
      </Link>
      <h2 className="text-3xl font-roboto font-bold text-center my-4">
        {title}
      </h2>

      <div className="w-11/12 max-w-lg bg-white dark:bg-gray-700 rounded-lg shadow-md p-8">
        {children}
      </div>
    </div>
  </>
);

export default FormLayout;
