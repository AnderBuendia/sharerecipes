import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import withCSRRedirect from '@Lib/hoc/with-csr-redirect.hoc';
import { withAuthGSSP } from '@Lib/hof/gssp.hof';
import { useForgotUserPassword } from '@Application/use-case/user/forgot-user-password.use-case.';
import FormLayout from '@Components/Layouts/FormLayout';
import Input from '@Components/generic/Input';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { FormMessages } from '@Enums/config/messages.enum';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import { TimeNotifications } from '@Enums/config/notifications.enum';
import type { IRedirect } from '@Interfaces/redirect.interface';
import type { FormValuesForgotUserPassword } from '@Types/forms/forgot-password.type';

const ForgotPasswordPage: NextPage = () => {
  const router = useRouter();
  const { forgotUserPassword } = useForgotUserPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesForgotUserPassword>();

  const onSubmit = handleSubmit(async (submitData) => {
    const { email } = submitData;
    const response = await forgotUserPassword({ email });

    if (response) {
      setTimeout(() => {
        router.push(MainPaths.INDEX);
      }, TimeNotifications.DELAY);
    }
  });

  return (
    <FormLayout
      title="Cannot login?"
      description="Have you forgot password?"
      url={MainPaths.FORGOT_USER_PASSWORD}
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

        <button className="btn-form bg-black">
          <span>Send Recovery Link</span>
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
  href: MainPaths.INDEX,
  statusCode: HTTPStatusCodes.FOUND,
  condition: RedirectConditions.REDIRECT_WHEN_USER_EXISTS,
};

export const getServerSideProps: GetServerSideProps = withAuthGSSP(redirect);

export default withCSRRedirect(ForgotPasswordPage, redirect);
