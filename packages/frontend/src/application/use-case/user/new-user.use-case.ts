import { useUser } from '@Services/user.service';
import { useNotifier } from '@Services/notification.service';
import { AlertMessages } from '@Enums/config/messages.enum';

export function useNewUser() {
  const { setCreateUser } = useUser();
  const [create_user] = setCreateUser();
  const { notifySuccess, notifyError } = useNotifier();

  const newUser = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await create_user({
        variables: {
          input: {
            name,
            email,
            password,
          },
        },
      });

      notifySuccess({ message: AlertMessages.USER_CREATED });

      return response;
    } catch (error) {
      if (error instanceof Error) {
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }
    }
  };

  return { newUser };
}
