import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import { removeJwtCookie } from '@Lib/utils/jwt-cookie.utils';
import { serverRedirect } from '@Lib/utils/ssr.utils';
import useUser from '@Lib/hooks/user/useUser';
import FormLayout from '@Components/Layouts/FormLayout';
import Input from '@Components/generic/Input';
import { MainPaths } from '@Enums/paths/main-paths';
import { RedirectConditions } from '@Enums/redirect-conditions';
import { FormMessages } from '@Enums/config/messages';

function ResetPasswordToken({ token }) {
  const router = useRouter();
  const { setResetPassword } = useUser();

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (submitData) => {
    const response = setResetPassword({ submitData, token });

    setTimeout(() => {
      if (response) return router.push(MainPaths.LOGIN);
      else return router.push(MainPaths.FORGOT_PASS);
    }, 3000);
  };

  return (
    <FormLayout
      title="Reset Your Password"
      description="Reset your password if you have forgotten it"
      url={MainPaths.FORGOT_PASS_CONFIRM}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="New Password"
          name="password"
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
          name="confirmPassword"
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

        <input className="btn-primary" type="submit" value="Reset Password" />
      </form>
      <div>
        <div className="border-gray border-t-2 block mt-8 text-center"></div>
        <div className="w-full">
          <Link href={MainPaths.LOGIN}>
            <a className="btn-default">Return to Login</a>
          </Link>
        </div>
      </div>
    </FormLayout>
  );
}

const redirect = {
  href: MainPaths.NOT_FOUND,
  statusCode: 302,
  condition: RedirectConditions.REDIRECT_WHEN_TOKEN_NOT_EXISTS,
};

export const getServerSideProps = async ({ params, res }) => {
  const props = { lostAuth: false };

  if (params && params.token) removeJwtCookie(res);
  else serverRedirect(res, redirect);

  props.componentProps = {
    token: params?.token,
  };

  return { props };
};

export default withCSRRedirect(ResetPasswordToken, redirect);
