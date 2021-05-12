import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
import { CREATE_USER } from '../lib/graphql/user/mutation';

/* enum conditions */
import { MainPaths } from '../enums/paths/main-paths';
import { RedirectConditions } from '../enums/redirect-conditions';
import { AlertMessages, FormMessages } from '../enums/config/messages';

/* components */
import FormLayout from '../components/layouts/FormLayout';
import Input from '../components/generic/Input';

const SignUp = () => {
  /* Routing */
  const router = useRouter();

  /* Set Toast Notification */
  const { addToast } = useToasts();

  /* Apollo mutation */
  const [newUser] = useMutation(CREATE_USER);

  /* React hook form */
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    const { name, email, password } = data;

    try {
      const { data } = await newUser({
        variables: {
          input: {
            name,
            email,
            password,
          },
        },
      });

      addToast(AlertMessages.USER_CREATED, { appearance: 'success' });

      /* Redirect to Home Page */
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
      title="Create your Account"
      description="Sign up to ShareYourRecipes"
      url={MainPaths.SIGNUP}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Username"
          name="name"
          type="text"
          placeholder="Introduce your Name"
          childRef={register({
            required: { value: true, message: FormMessages.USER_REQUIRED },
          })}
          error={errors.name}
        />

        <Input
          label="Email"
          name="email"
          type="text"
          placeholder="example@example.com"
          childRef={register({
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: FormMessages.EMAIL_FORMAT_INVALID,
            },
          })}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
          childRef={register({
            required: FormMessages.PASSWORD_REQUIRED,
            minLength: {
              value: 7,
              message: FormMessages.MIN_LENGTH,
            },
          })}
          error={errors.password}
        />

        <input className="btn-primary" type="submit" value="Create Account" />
      </form>
      <p className="text-lg font-roboto font-bold text-gray-800 mt-8 text-center">
        Have an account?{' '}
        <Link href="/login">
          <a className="underline text-blue-400">Log in</a>
        </Link>
      </p>
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

export default withCSRRedirect(SignUp, redirect);
