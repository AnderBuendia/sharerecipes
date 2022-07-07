import { useAuthStore } from '@Lib/context/auth-store.context';
import { useAppStore } from '@Lib/context/app-store.context';
import type { UserStorageService } from '@Interfaces/ports/service/storage-service.interface';
import type { SearchStorageService } from '@Interfaces/ports/service/storage-service.interface';
import type { RecipeStorageService } from '@Interfaces/ports/service/storage-service.interface';

export const useUserStorage = (): UserStorageService => {
  return useAuthStore();
};

export const useSearchStorage = (): SearchStorageService => {
  return useAppStore();
};

export const useRecipeStorage = (): RecipeStorageService => {
  return useAppStore();
};
