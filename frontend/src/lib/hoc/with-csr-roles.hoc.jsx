import { useState, useEffect } from 'react';
import useUser from '@Lib/hooks/user/useUser';
import Custom404 from '@Pages/404';
import Spinner from '@Components/generic/Spinner';

const withCSRRoles = (Component, allowedRoles) => (props) => {
  const { authState } = useUser();
  const [component, setComponent] = useState(<Spinner />);

  useEffect(() => {
    if (
      allowedRoles.length &&
      !allowedRoles.some((role) => authState.user?.role?.includes(role))
    ) {
      setComponent(<Custom404 />);
    } else {
      setComponent(<Component {...props}></Component>);
    }
  }, []);

  return component;
};

export default withCSRRoles;
