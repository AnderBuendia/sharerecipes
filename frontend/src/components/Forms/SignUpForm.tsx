import type { FC } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useNewUser } from '@Application/use-case/user/new-user.use-case';
import FormLayout from '@Components/Layouts/FormLayout';
import Input from '@Components/generic/Input';
import { FormMessages } from '@Enums/config/messages.enum';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import type { FormValuesSignUpForm } from '@Types/forms/signup-form.type';

const SignUpForm: FC = () => {
  const router = useRouter();
  const { newUser } = useNewUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesSignUpForm>();

  const onSubmit = handleSubmit(async (submitData) => {
    const { name, email, password } = submitData;
    const response = await newUser({ name, email, password });

    if (response?.data) {
      setTimeout(() => {
        router.push(MainPaths.INDEX);
      }, 3000);
    }
  });

  return (
    <FormLayout
      title="Create your Account"
      description="Sign up to ShareYourRecipes"
      url={MainPaths.SIGNUP}
    >
      <form onSubmit={onSubmit}>
        <Input
          label="Username"
          type="text"
          placeholder="Introduce your Name"
          register={{
            ...register('name', {
              required: FormMessages.USER_REQUIRED,
            }),
          }}
          error={errors.name}
        />

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
          <span>Create Account</span>
        </button>
      </form>
      <p className="text-lg font-roboto font-bold mt-4 text-center">
        Have an account?{' '}
        <Link href={MainPaths.LOGIN}>
          <a className="underline text-blue-400">Log in</a>
        </Link>
      </p>
    </FormLayout>
  );
};

export default SignUpForm;
