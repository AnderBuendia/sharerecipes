import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateUser } from '@Application/use-case/user/update-user.use-case';
import { useUserStorage } from '@Services/storageAdapter';
import { FormMessages } from '@Enums/config/messages.enum';
import DragDropImage from '@Components/generic/DragDropImage';
import Input from '@Components/generic/Input';
import type { AuthState } from '@Interfaces/domain/auth.interface';
import { ApiV1RestEndPoints } from '@Enums/paths/rest-endpoints.enum';

export type FormValuesProfileData = {
  name: string;
  password: string;
};

const ProfileData: FC = () => {
  const { authState, setAuth } = useUserStorage();
  const { updateUser } = useUpdateUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesProfileData>({
    defaultValues: {
      name: authState?.user ? authState.user.name : '',
      password: '',
    },
  });

  const handleImageUser = (imageUrl: string, imageName: string) => {
    setAuth((oldState: AuthState): AuthState => {
      if (
        oldState.user?.image_name !== imageName ||
        oldState.user?.image_url !== imageUrl
      ) {
        return {
          ...oldState,
          user: {
            ...oldState.user,
            image_url: imageUrl,
            image_name: imageName,
          },
        } as AuthState;
      }

      return oldState;
    });
  };

  const onSubmit = handleSubmit(async (submitData) => {
    const { name, password } = submitData;
    await updateUser({ name, password, email: authState?.user?.email });
  });

  return (
    <div className="mdxl:w-11/12 bg-white dark:bg-gray-700 rounded-lg shadow-md mt-3 p-5">
      <div className="w-full text-center">
        <label className="font-bold font-body">Profile picture</label>
        <div className="flex w-32 h-32 overflow-hidden mx-auto rounded-full my-4 text-black">
          <DragDropImage
            url={`${process.env.NEXT_PUBLIC_BACKEND_URL}${ApiV1RestEndPoints.UPLOAD_USER_IMAGE}`}
            current={authState?.user?.image_url}
            name="photo"
            rounded
            handleChange={handleImageUser}
          />
        </div>
      </div>
      <div className="w-full">
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
            label="Password"
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

          <button className="btn-form bg-black mt-3">
            <span>Edit account</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileData;
