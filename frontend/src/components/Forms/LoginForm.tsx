import { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { getLoginRequest } from '@Lib/service/getLoginRequest';
import FormLayout from '@Components/Layouts/FormLayout';
import Input from '@Components/generic/Input';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { FormMessages } from '@Enums/config/messages.enum';
import { FormValuesLoginForm } from '@Types/forms/login-form.type';

const LoginForm: FC = () => {
  const router = useRouter();
  const { loginRequest } = getLoginRequest(router);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesLoginForm>();

  const onSubmit = handleSubmit(async (data) => {
    await loginRequest(data);
  });

  return (
    <FormLayout
      title="Login Your Account"
      description="Sign in to ShareYourRecipes"
      url={MainPaths.LOGIN}
    >
      <form onSubmit={onSubmit}>
        <Input
          label="Email"
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

        <Input
          label="Password"
          type="password"
          placeholder="Password"
          register={{
            ...register('password', {
              required: FormMessages.PASSWORD_REQUIRED,
              minLength: {
                value: 7,
                message: FormMessages.MIN_LENGTH,
              },
            }),
          }}
          error={errors.password}
        />

        <input className="btn-primary" type="submit" value="Login" />
      </form>

      <div>
        <div className="w-full text-right mt-4">
          <Link href={MainPaths.FORGOT_PASSWORD}>
            <a className="font-roboto underline font-medium text-gray-400 mt-8 text-center">
              Forgot Password?
            </a>
          </Link>
        </div>
        <div className="border-gray border-t-2 block mt-8 text-center"></div>
        <div className="w-full">
          <p className="text-lg font-roboto font-bold mt-8 text-center">
            You don't have an account?
          </p>
          <Link href={MainPaths.SIGNUP}>
            <a className="btn-default dark:bg-gray-500">Create New Account</a>
          </Link>
        </div>
      </div>
    </FormLayout>
  );
};

export default LoginForm;
