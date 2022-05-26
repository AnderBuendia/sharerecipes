import { useUser } from '@Services/userAdapter';
import { useNotifier } from '@Services/notificationAdapter';
import {
  FormMessages,
  AlertMessages,
  MessageTypes,
} from '@Enums/config/messages.enum';

export function useUpdateUser() {
  const { setUpdateUser } = useUser();
  const [update_user] = setUpdateUser();
  const { notify } = useNotifier();

  const updateUser = async ({
    name,
    password,
    email,
  }: {
    name: string;
    password: string;
    email?: string;
  }) => {
    try {
      if (!email) throw new Error(FormMessages.EMAIL_REQUIRED);

      const response = await update_user({
        variables: {
          input: {
            name,
            password,
            email,
          },
        },
      });

      notify({
        message: AlertMessages.PROFILE_UPDATED,
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

  return { updateUser };
}
