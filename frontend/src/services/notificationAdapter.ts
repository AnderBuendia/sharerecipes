import { useToasts, AppearanceTypes } from 'react-toast-notifications';
import { NotificationService } from '@Interfaces/ports/notification.interface';

export function useNotifier(): NotificationService {
  const { addToast } = useToasts();

  const notify = ({
    message,
    messageType,
  }: {
    message: string;
    messageType: AppearanceTypes;
  }) => {
    addToast(message, { appearance: messageType });
  };

  return { notify };
}
