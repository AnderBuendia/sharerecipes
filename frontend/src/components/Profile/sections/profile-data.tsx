import { FC } from 'react';
import { useForm } from 'react-hook-form';
import useUser from '@Lib/hooks/user/useUser';
import { FormMessages } from '@Enums/config/messages.enum';
import DragDropImage from '@Components/generic/DragDropImage';
import Input from '@Components/generic/Input';

export type FormValuesProfileData = {
  name: string;
  password: string;
};

const ProfileData: FC = () => {
  const { authState, setImageUser, setUpdateUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesProfileData>({
    defaultValues: {
      name: authState.user ? authState.user.name : '',
      password: '',
    },
  });

  const handleImageUser = (imageUrl: string, imageName: string) => {
    setImageUser({ image_url: imageUrl, image_name: imageName });
  };

  const onSubmit = handleSubmit(async (submitData) => {
    const { name, password } = submitData;
    await setUpdateUser({ name, password });
  });

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

          <input className="btn-primary" type="submit" value="Edit account" />
        </form>
      </div>
    </div>
  );
};

export default ProfileData;
