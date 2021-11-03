import { FC } from 'react';
import Custom404 from '@Pages/404';

export type WithCSRAllowProps = {
  isAllowed: boolean;
  [prop: string]: any;
};

const withCSRAllowPaths =
  (Component: FC<any>) =>
  ({ isAllowed, ...props }: WithCSRAllowProps) =>
    isAllowed ? <Component {...props}></Component> : <Custom404 />;

export default withCSRAllowPaths;
