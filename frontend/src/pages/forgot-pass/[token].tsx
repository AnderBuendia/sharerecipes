import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import { removeJwtCookie } from '@Lib/utils/jwt-cookie.utils';
import { serverRedirect } from '@Lib/utils/ssr.utils';
import { useResetPassword } from '@Application/user/resetPassword';
import FormLayout from '@Components/Layouts/FormLayout';
import Input from '@Components/generic/Input';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { IRedirect } from '@Interfaces/redirect.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { FormMessages } from '@Enums/config/messages.enum';
import { FormValuesResetPasswordToken } from '@Types/forms/reset-password-token.type';

export type ResetPasswordTokenPageProps = {
  token: string;
};

const ResetPasswordTokenPage: NextPage<ResetPasswordTokenPageProps> = ({
  token,
}) => {
  const router = useRouter();
  const { resetPassword } = useResetPassword();

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesResetPasswordToken>();

  const onSubmit = handleSubmit(async (submitData) => {
    const { password } = submitData;
    const response = await resetPassword({ password, token });

    setTimeout(() => {
      if (response) return router.push(MainPaths.LOGIN);
      else return router.push(MainPaths.FORGOT_PASSWORD);
    }, 3000);
  });

  return (
    <FormLayout
      title="Reset Your Password"
      description="Reset your password if you have forgotten it"
      url={MainPaths.FORGOT_PASSWORD_CONFIRM}
    >
      <form onSubmit={onSubmit}>
        <Input
          label="New Password"
          type="password"
          placeholder="Introduce a New Password"
          register={{
            ...register('password', {
              required: FormMessages.PASSWORD_REQUIRED,
              minLength: {
                value: 7,
                message: 'Minimum 7 characters',
              },
            }),
          }}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm New Password"
          register={{
            ...register('confirmPassword', {
              required: FormMessages.CONFIRM_NEW_PASSWORD,
              validate: {
                matchesPreviousPassword: (value) => {
                  const { password } = getValues();
                  return password === value || FormMessages.MATCH_PASSWORDS;
                },
              },
            }),
          }}
          error={errors.confirmPassword}
        />

        <button className="btn-form bg-black">
          <span>Reset Password</span>
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
  href: MainPaths.NOT_FOUND,
  statusCode: 302,
  condition: RedirectConditions.REDIRECT_WHEN_TOKEN_NOT_EXISTS,
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { params, res } = ctx;
  const props: GSSProps = { lostAuth: false };

  if (params && params.token) removeJwtCookie(res);
  else serverRedirect(res, redirect);

  props.componentProps = {
    token: params?.token,
  };

  return { props };
};

export default withCSRRedirect(ResetPasswordTokenPage, redirect);
