import React from 'react';
import Custom404 from '../../pages/404';

const withCSRAllowPaths = (Component) => ({ isAllowed, ...props }) =>
  isAllowed ? <Component {...props}></Component> : <Custom404 />;

export default withCSRAllowPaths;
