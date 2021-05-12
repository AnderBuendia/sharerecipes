import React, { useState, useEffect, useContext } from 'react';
import Custom404 from '../../pages/404';
import AuthContext from '../context/auth/authContext';
import Spinner from '../../components/generic/Spinner';

const withCSRRoles = (Component, allowedRoles) => (props) => {
  const { authState } = useContext(AuthContext);
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
