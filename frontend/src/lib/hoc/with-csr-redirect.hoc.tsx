import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useUser from '@Lib/hooks/user/useUser';
import { generateQueryParams } from '@Lib/utils/url.utils';
import { IRedirect } from '@Interfaces/redirect.interface';
import { RedirectConditions } from '@Enums/redirect-conditions';

const withCSRRedirect = (Component: FC<any>, redirect: IRedirect) => {
  const { href, asPath, condition, query } = redirect;

  return (props: any) => {
    const router = useRouter();
    const { authState } = useUser();
    const [shouldRender, setShouldRender] = useState<boolean>(
      !!props.shouldRender
    );

    useEffect(() => {
      redirect();
    }, []);

    const redirect = () => {
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
    };

    return shouldRender ? <Component {...props}></Component> : <></>;
  };
};

export default withCSRRedirect;
