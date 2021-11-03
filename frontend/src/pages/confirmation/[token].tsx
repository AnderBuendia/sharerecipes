import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { removeJwtCookie } from '@Lib/utils/jwt-cookie.utils';
import { checkActivationToken } from '@Lib/utils/user.utils';
import MainLayout from '@Components/Layouts/MainLayout';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { AlertMessages } from '@Enums/config/messages.enum';

const ConfirmationTokenPage: NextPage = () => {
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

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { params, res } = ctx;
  const props: GSSProps = {};

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

export default ConfirmationTokenPage;
