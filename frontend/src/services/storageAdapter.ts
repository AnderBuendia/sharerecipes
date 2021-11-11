import { useAuthStore } from '@Lib/context/auth-store.context';
import { useAppStore } from '@Lib/context/app-store.context';
import { UserStorageService } from '@Interfaces/ports/storage.interface';
import { SearchStorageService } from '@Interfaces/ports/storage.interface';

export const useUserStorage = (): UserStorageService => {
  return useAuthStore();
};

export const useSearchStorage = (): SearchStorageService => {
  return useAppStore();
};
