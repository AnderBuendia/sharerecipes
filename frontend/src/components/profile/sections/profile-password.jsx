import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import AuthContext from '../../../lib/context/auth/authContext';
import { UPDATE_USER_PASSWORD } from '../../../lib/graphql/user/mutation';
import { ProfilePaths } from '../../../enums/paths/profile-paths';
import { AlertMessages, FormMessages } from '../../../enums/config/messages';
import Input from '../../generic/Input';

const ProfilePassword = () => {
  const { authState } = useContext(AuthContext);
  const { addToast } = useToasts();

  const router = useRouter();

  /* Apollo mutation to update password */
  const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD);

  /* React hook form */
  const { register, handleSubmit, getValues, errors } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    const { confirmPassword, password } = data;
    try {
      await updateUserPassword({
        variables: {
          input: {
            email: authState.user.email,
            password,
            confirmPassword,
          },
        },
      });

      addToast(AlertMessages.PASSWORD_UPDATED, { appearance: 'success' });
      router.push(ProfilePaths.MAIN);
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  };

  return (
    <div className="mdxl:w-11/12 bg-white dark:bg-gray-700 rounded-lg shadow-md mt-3 p-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Introduce your Password"
          childRef={register({
            required: FormMessages.CURRENT_PASSWORD_REQUIRED,
          })}
          error={errors.password}
        />

        <Input
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="Introduce a New Password"
          childRef={register({
            required: FormMessages.NEW_PASSWORD_REQUIRED,
            minLength: {
              value: 7,
              message: FormMessages.MIN_LENGTH,
            },
          })}
          error={errors.newPassword}
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          childRef={register({
            required: FormMessages.CONFIRM_NEW_PASSWORD,
            validate: {
              matchesPreviousPassword: (value) => {
                const { newpassword } = getValues();
                return newpassword === value || FormMessages.MATCH_PASSWORDS;
              },
            },
          })}
          error={errors.confirmPassword}
        />

        <input className="btn-primary" type="submit" value="Change Password" />
      </form>
    </div>
  );
};

export default ProfilePassword;
