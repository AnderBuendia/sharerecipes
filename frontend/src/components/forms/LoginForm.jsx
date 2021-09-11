import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { getLoginRequest } from '../../lib/service/getLoginRequest';
import { FormMessages } from '../../enums/config/messages';
import FormLayout from '../../components/layouts/FormLayout';
import Input from '../../components/generic/Input';
import { MainPaths } from '../../enums/paths/main-paths';

const LoginForm = () => {
  const router = useRouter();
  const { loginRequest } = getLoginRequest(router);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await loginRequest(data);
  };

  return (
    <FormLayout
      title="Login Your Account"
      description="Sign in to ShareYourRecipes"
      url={MainPaths.LOGIN}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          name="email"
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
          name="password"
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
          <Link href={MainPaths.FORGOT_PASS}>
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
