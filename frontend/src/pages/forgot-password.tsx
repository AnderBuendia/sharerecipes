import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { decode } from 'jsonwebtoken';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '@Lib/utils/ssr.utils';
import { useForgotUserPassword } from '@Application/use-case/user/forgot-user-password.use-case.';
import FormLayout from '@Components/Layouts/FormLayout';
import Input from '@Components/generic/Input';
import type { GSSProps } from '@Interfaces/props/gss-props.interface';
import type { IRedirect } from '@Interfaces/redirect.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { FormMessages } from '@Enums/config/messages.enum';
import type { FormValuesForgotUserPassword } from '@Types/forms/forgot-password.type';

const DELAY_TIME_NOTIFICATION = 3000;

const ForgotPasswordPage: NextPage = () => {
  const router = useRouter();
  const { forgotUserPassword } = useForgotUserPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesForgotUserPassword>();

  const onSubmit = handleSubmit(async (submitData) => {
    const { email } = submitData;
    const response = await forgotUserPassword({ email });

    if (response) {
      setTimeout(() => {
        router.push(MainPaths.INDEX);
      }, DELAY_TIME_NOTIFICATION);
    }
  });

  return (
    <FormLayout
      title="Cannot login?"
      description="Have you forgot password?"
      url={MainPaths.FORGOT_USER_PASSWORD}
    >
      <form onSubmit={onSubmit}>
        <Input
          label="We'll send a recovery link to"
          type="text"
          placeholder="example@example.com"
          register={{
            ...register('email', {
              required: FormMessages.EMAIL_REQUIRED,
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: FormMessages.EMAIL_FORMAT_INVALID,
              },
            }),
          }}
          error={errors.email}
        />

        <button className="btn-form bg-black">
          <span>Send Recovery Link</span>
        </button>
      </form>

      <div className="border-gray border-t-2 block my-4"></div>

      <div className="flex flex-col justify-center items-center text-center">
        <Link href={MainPaths.LOGIN}>
          <a className="btn-form bg-orange-400">Return to Login</a>
        </Link>
      </div>
    </FormLayout>
  );
};

const redirect: IRedirect = {
  href: MainPaths.INDEX,
  statusCode: 302,
  condition: RedirectConditions.REDIRECT_WHEN_USER_EXISTS,
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const props: GSSProps = { lostAuth: false };
  const isSSR = isRequestSSR(ctx.req.url);
  const jwt = getJwtFromCookie(ctx.req.headers.cookie);

  if (jwt) {
    if (isSSR) {
      const apolloClient = createApolloClient();
      const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

      if (authProps) serverRedirect(ctx.res, redirect);
    } else if (!decode(jwt)) props.lostAuth = true;
  }

  props.componentProps = {
    shouldRender: !jwt || props.lostAuth,
  };

  return { props };
};

export default withCSRRedirect(ForgotPasswordPage, redirect);
