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
import { useForgotPassword } from '@Application/user/forgotPassword';
import FormLayout from '@Components/Layouts/FormLayout';
import Input from '@Components/generic/Input';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { IRedirect } from '@Interfaces/redirect.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { FormMessages } from '@Enums/config/messages.enum';
import { FormValuesForgotPassword } from '@Types/forms/forgot-password.type';

const ForgotPasswordPage: NextPage = () => {
  const router = useRouter();
  const { forgotPassword } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesForgotPassword>();

  const onSubmit = handleSubmit(async (submitData) => {
    const { email } = submitData;
    const response = await forgotPassword({ email });

    if (response) {
      setTimeout(() => {
        router.push(MainPaths.INDEX);
      }, 3000);
    }
  });

  return (
    <FormLayout
      title="Cannot login?"
      description="Have you forgot password?"
      url={MainPaths.FORGOT_PASSWORD}
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

        <input
          className="btn-primary"
          type="submit"
          value="Send Recovery Link"
        />
      </form>
      <div>
        <div className="border-gray border-t-2 block mt-8 text-center"></div>
        <div className="w-full">
          <Link href={MainPaths.LOGIN}>
            <a className="btn-default dark:bg-gray-500">Return to Login</a>
          </Link>
        </div>
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
