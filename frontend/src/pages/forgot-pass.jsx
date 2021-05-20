import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import { decode } from 'jsonwebtoken';
import { createApolloClient } from '../lib/apollo/apollo-client';
import withCSRRedirect from '../lib/hoc/with-csr-redirect.hoc';
import { getJwtFromCookie } from '../lib/utils/jwt-cookie.utils';
import {
  isRequestSSR,
  loadAuthProps,
  serverRedirect,
} from '../lib/utils/ssr.utils';
import { FORGOT_PASSWORD } from '../lib/graphql/user/query';

/* enum conditions */
import { MainPaths } from '../enums/paths/main-paths';
import { RedirectConditions } from '../enums/redirect-conditions';
import { AlertMessages, FormMessages } from '../enums/config/messages';

/* Components */
import FormLayout from '../components/layouts/FormLayout';
import Input from '../components/generic/Input';

const ForgotPass = () => {
  const router = useRouter();

  /* Set Toast Notification */
  const { addToast } = useToasts();

  /* Apollo mutation */
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  /* React hook form */
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
  });
  const onSubmit = async (data) => {
    const { email } = data;

    try {
      const { data } = await forgotPassword({
        variables: {
          input: {
            email,
          },
        },
      });
      addToast(AlertMessages.CHECK_ACTIVATION_MAIL, { appearance: 'success' });

      setTimeout(() => {
        router.push(MainPaths.INDEX);
      }, 3000);
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  };

  return (
    <FormLayout
      title="Can' t login?"
      description="Have you forgot password?"
      url={MainPaths.FORGOT_PASS}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="We'll send a recovery link to"
          name="email"
          type="text"
          placeholder="example@example.com"
          childRef={register({
            required: FormMessages.EMAIL_REQUIRED,
            pattern: {
              value:
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: FormMessages.EMAIL_FORMAT_INVALID,
            },
          })}
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

const redirect = {
  href: MainPaths.INDEX,
  statusCode: 302,
  condition: RedirectConditions.REDIRECT_WHEN_USER_EXISTS,
};

export const getServerSideProps = async (ctx) => {
  const props = { lostAuth: false };
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

export default withCSRRedirect(ForgotPass, redirect);
