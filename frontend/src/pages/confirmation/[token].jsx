import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { removeJwtCookie } from '@Lib/utils/jwt-cookie.utils';
import { checkActivationToken } from '@Lib/utils/user.utils';
import MainLayout from '@Components/Layouts/MainLayout';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes';
import { MainPaths } from '@Enums/paths/main-paths';
import { AlertMessages } from '@Enums/config/messages';

const ConfirmationToken = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push(MainPaths.LOGIN);
    }, 4000);
  }, [router]);

  return (
    <MainLayout
      title="Account confirmation"
      description="Your account has been confirmed"
      url={MainPaths.CONFIRMATION}
    >
      <div className="flex w-full mx-auto mt-8 justify-center">
        <div className="bg-white dark:bg-gray-700 text-black rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
          <div className="w-full max-w-lg bg-green-200 text-black rounded-lg shadow-md px-8 pt-6 pb-8 mb-4">
            <p>{AlertMessages.ACTIVATE_ACCOUNT}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps = async ({ params, res }) => {
  const props = {};

  if (params && params.token) {
    const activationToken = await checkActivationToken(params.token);

    if (activationToken) {
      removeJwtCookie(res);
    } else {
      res.statusCode = HTTPStatusCodes.NOT_FOUND;
    }
  }

  props.componentProps = {
    token: params?.token,
  };

  return { props };
};

export default ConfirmationToken;
