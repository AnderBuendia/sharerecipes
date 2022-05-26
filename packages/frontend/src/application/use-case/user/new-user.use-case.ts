import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { AlertMessages, MessageTypes } from '@Enums/config/messages.enum';

export function useNewUser() {
  const { setCreateUser } = useUser();
  const [create_user] = setCreateUser();
  const { notify } = useNotifier();

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

      notify({
        message: AlertMessages.USER_CREATED,
        messageType: MessageTypes.SUCCESS,
      });

      return response;
    } catch (error) {
      if (error instanceof Error) {
        notify({
          message: error.message.replace('GraphQL error: ', ''),
          messageType: MessageTypes.ERROR,
        });
      }
    }
  };

  return { newUser };
}
