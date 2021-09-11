import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';
import FormLayout from '@Components/layouts/FormLayout';
import Input from '@Components/generic/Input';
import { CREATE_USER } from '@Lib/graphql/user/mutation';
import { AlertMessages, FormMessages } from '@Enums/config/messages';
import { MainPaths } from '@Enums/paths/main-paths';

const SignUpForm = () => {
  const router = useRouter();
  const { addToast } = useToasts();
  const [newUser] = useMutation(CREATE_USER);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { name, email, password } = data;

    try {
      await newUser({
        variables: {
          input: {
            name,
            email,
            password,
          },
        },
      });

      addToast(AlertMessages.USER_CREATED, { appearance: 'success' });

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
          register={{
            ...register('name', {
              required: FormMessages.USER_REQUIRED,
            }),
          }}
          error={errors.name}
        />

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

        <input className="btn-primary" type="submit" value="Create Account" />
      </form>
      <p className="text-lg font-roboto font-bold mt-8 text-center">
        Have an account?{' '}
        <Link href="/login">
          <a className="underline text-blue-400">Log in</a>
        </Link>
      </p>
    </FormLayout>
  );
};

export default SignUpForm;
