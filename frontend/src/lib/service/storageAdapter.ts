import { useAuthStore } from '@Lib/context/auth-store.context';
import { UserStorageService } from '@Interfaces/ports/user-storage.interface';

export const useUserStorage = (): UserStorageService => {
  return useAuthStore();
};
