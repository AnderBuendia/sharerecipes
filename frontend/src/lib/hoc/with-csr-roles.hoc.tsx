import { FC, ReactElement, useState, useEffect } from 'react';
import useUser from '@Lib/hooks/user/useUser';
import Custom404 from '@Pages/404';
import Spinner from '@Components/generic/Spinner';
import { UserRoles } from '@Enums/user/user-roles.enum';

const withCSRRoles =
  (Component: FC<any>, allowedRoles: UserRoles[] = []) =>
  (props: any) => {
    const { authState } = useUser();
    const [component, setComponent] = useState<ReactElement>(<Spinner />);

    useEffect(() => {
      if (
        allowedRoles.length &&
        !allowedRoles.some((role) => authState.user?.role?.includes(role))
      ) {
        setComponent(<Custom404 />);
      } else {
        setComponent(<Component {...props}></Component>);
      }
    }, [authState]);

    return component;
  };

export default withCSRRoles;
