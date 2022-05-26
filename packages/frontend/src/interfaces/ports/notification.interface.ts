import { AppearanceTypes } from 'react-toast-notifications';

export interface NotificationService {
  notify: ({
    message,
    messageType,
  }: {
    message: string;
    messageType: AppearanceTypes;
  }) => void;
}
