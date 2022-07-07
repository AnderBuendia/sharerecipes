import type { FC } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useUpdateUserPassword } from '@Application/use-case/user/update-user-password.use-case';
import { useUserStorage } from '@Services/storage.service';
import Input from '@Components/generic/Input';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';
import { FormMessages } from '@Enums/config/messages.enum';
import type { FormValuesProfilePassword } from '@Types/forms/profile-password.type';

const ProfilePassword: FC = () => {
  const router = useRouter();
  const { authState } = useUserStorage();
  const { updateUserPassword } = useUpdateUserPassword();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValuesProfilePassword>({ mode: 'onChange' });

  const onSubmit = handleSubmit(async (submitData) => {
    const { password, confirmPassword } = submitData;
    const response = await updateUserPassword({
      password,
      confirmPassword,
      email: authState?.user?.email,
    });

    if (response?.data) router.push(ProfilePaths.MAIN);
  });

  return (
    <div className="mdxl:w-11/12 bg-white dark:bg-gray-700 rounded-lg shadow-md mt-3 p-5">
      <form onSubmit={onSubmit}>
        <Input
          label="Password"
          type="password"
          placeholder="Introduce your Password"
          register={{
            ...register('password', {
              required: FormMessages.CURRENT_PASSWORD_REQUIRED,
            }),
          }}
          error={errors.password}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Introduce a New Password"
          register={{
            ...register('newPassword', {
              required: FormMessages.NEW_PASSWORD_REQUIRED,
              minLength: {
                value: 7,
                message: FormMessages.MIN_LENGTH,
              },
            }),
          }}
          error={errors.newPassword}
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
                  const { newPassword } = getValues();
                  return newPassword === value || FormMessages.MATCH_PASSWORDS;
                },
              },
            }),
          }}
          error={errors.confirmPassword}
        />

        <button className="btn-form bg-black">
          <span>Change Password</span>
        </button>
      </form>
    </div>
  );
};

export default ProfilePassword;
