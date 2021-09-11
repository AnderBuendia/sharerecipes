import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import AuthContext from '../../../lib/context/auth/authContext';
import { UPDATE_USER } from '../../../lib/graphql/user/mutation';
import { AlertMessages, FormMessages } from '../../../enums/config/messages';
import DragDropImage from '../../generic/DragDropImage';
import Input from '../../generic/Input';

const ProfileData = () => {
  const { addToast } = useToasts();
  const { authState, setAuth } = useContext(AuthContext);

  const setImageUser = (url, setAuth) => {
    const { filename, image_url } = url;

    setAuth({
      ...authState,
      user: {
        ...authState.user,
        image_url,
        image_name: filename,
      },
    });
  };

  const getUpdateUser = (setAuth) => {
    const [updateUser] = useMutation(UPDATE_USER, {
      onCompleted: ({ updateUser: response }) => {
        setAuth({
          ...authState,
          user: {
            ...authState.user,
            name: response.name,
          },
        });
      },
    });

    return { updateUser };
  };

  const { updateUser } = getUpdateUser(setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: authState.user.name,
      password: '',
    },
  });

  const onSubmit = async (data) => {
    const { name, password } = data;

    try {
      await updateUser({
        variables: {
          input: {
            name,
            email: authState.user.email,
            password,
          },
        },
      });

      addToast(AlertMessages.PROFILE_UPDATED, { appearance: 'success' });
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  };

  return (
    <div className="mdxl:w-11/12 bg-white dark:bg-gray-700 rounded-lg shadow-md mt-3 p-5">
      <div className="w-full text-center">
        <label className="font-bold font-body">Profile picture</label>
        <div className="flex w-32 h-32 overflow-hidden mx-auto rounded-full my-4">
          <DragDropImage
            url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/user`}
            current={authState.user?.image_url}
            name="photo"
            rounded
            onChange={(url) => setImageUser(url, setAuth)}
          />
        </div>
      </div>
      <div className="w-full">
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
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            register={{
              ...register('password', {
                required: FormMessages.CURRENT_PASSWORD_REQUIRED,
                minLength: {
                  value: 7,
                  message: FormMessages.MIN_LENGTH,
                },
              }),
            }}
            error={errors.password}
          />

          <input className="btn-primary" type="submit" value="Edit account" />
        </form>
      </div>
    </div>
  );
};

export default ProfileData;
