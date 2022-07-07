import { toast } from 'react-toastify';
import type { NotificationService } from '@Interfaces/ports/service/notification-service.interface';

export function useNotifier(): NotificationService {
  const notifyError = ({ message }: { message: string }) => {
    toast.error(message);
  };

  const notifySuccess = ({ message }: { message: string }) => {
    toast.success(message);
  };

  return { notifyError, notifySuccess };
}
