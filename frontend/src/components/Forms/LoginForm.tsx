import type { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthenticate } from '@Application/authenticate';
import FormLayout from '@Components/Layouts/FormLayout';
import Input from '@Components/generic/Input';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { FormMessages } from '@Enums/config/messages.enum';
import type { FormValuesLoginForm } from '@Types/forms/login-form.type';

const LoginForm: FC = () => {
  const router = useRouter();
  const { signIn } = useAuthenticate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesLoginForm>();

  const onSubmit = handleSubmit(async (data) => {
    const response = await signIn(data);

    if (response) {
      setTimeout(() => {
        router.push(MainPaths.INDEX);
      }, 3000);
    }
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

        <button className="btn-form bg-black">
          <span>Login</span>
        </button>
      </form>

      <div>
        <div className="w-full text-right">
          <Link href={MainPaths.FORGOT_USER_PASSWORD}>
            <a className="font-roboto underline font-medium text-gray-400 hover:text-blue-400 mt-8 text-center">
              <span>Forgot Password?</span>
            </a>
          </Link>
        </div>

        <div className="border-gray border-t-2 block mt-4 text-center"></div>

        <div className="flex flex-col justify-center items-center text-center">
          <p className="text-lg font-roboto font-bold mt-4">
            You don't have an account?
          </p>
          <Link href={MainPaths.SIGNUP}>
            <a className="btn-form bg-orange-400">
              <span>Create New Account</span>
            </a>
          </Link>
        </div>
      </div>
    </FormLayout>
  );
};

export default LoginForm;
