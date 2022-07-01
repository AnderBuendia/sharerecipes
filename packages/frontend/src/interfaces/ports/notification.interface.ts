export interface NotificationService {
  notifyError({ message }: { message: string }): void;
  notifySuccess({ message }: { message: string }): void;
}
