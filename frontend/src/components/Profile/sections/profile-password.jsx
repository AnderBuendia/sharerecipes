import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useUser from '@Lib/hooks/user/useUser';
import { ProfilePaths } from '@Enums/paths/profile-paths';
import { FormMessages } from '@Enums/config/messages';
import Input from '@Components/generic/Input';

const ProfilePassword = () => {
  const { setUpdateUserPassword } = useUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (submitData) => {
    const response = setUpdateUserPassword({ submitData });

    if (response) router.push(ProfilePaths.MAIN);
  };

  return (
    <div className="mdxl:w-11/12 bg-white dark:bg-gray-700 rounded-lg shadow-md mt-3 p-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Password"
          name="password"
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
          name="newPassword"
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
          name="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          register={{
            ...register('confirmPassword', {
              required: FormMessages.CONFIRM_NEW_PASSWORD,
              validate: {
                matchesPreviousPassword: (value) => {
                  const { newPassword } = getValues();
                  console.log(newPassword);
                  return newPassword === value || FormMessages.MATCH_PASSWORDS;
                },
              },
            }),
          }}
          error={errors.confirmPassword}
        />

        <input className="btn-primary" type="submit" value="Change Password" />
      </form>
    </div>
  );
};

export default ProfilePassword;
