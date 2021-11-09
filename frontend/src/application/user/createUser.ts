import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import { AlertMessages, MessageTypes } from '@Enums/config/messages.enum';

export function useCreateUser() {
  const { setNewUser } = useUser();
  const [newUserMutation] = setNewUser();
  const { notify } = useNotifier();

  const createUser = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await newUserMutation({
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

  return { createUser };
}
