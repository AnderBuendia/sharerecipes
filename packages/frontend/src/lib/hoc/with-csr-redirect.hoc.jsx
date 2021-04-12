import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../context/auth/authContext';
import { generateQueryParams } from '../utils/url.utils';
import { RedirectConditions } from '../../enums/redirect-conditions';

const withCSRRedirect = (Component, redirect) => {
  const { href, asPath, condition, query } = redirect;

  return (props) => {
    const router = useRouter();
    const { authState } = useContext(AuthContext);
    const [shouldRender, setShouldRender] = useState(!!props.shouldRender);

    useEffect(() => {
      if (
        (authState.jwt &&
          condition === RedirectConditions.REDIRECT_WHEN_USER_EXISTS) ||
        (!authState.jwt &&
          condition === RedirectConditions.REDIRECT_WHEN_USER_NOT_EXISTS)
      ) {
        let queryString;

        if (query) return (queryString = generateQueryParams(query));

        const url = queryString ? `${href}?${queryString}` : href;

        router.replace(url, asPath);
      } else setShouldRender(true);
    }, []);

    return shouldRender ? <Component {...props}></Component> : <></>;
  };
};

export default withCSRRedirect;
