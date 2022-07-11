import type { Dispatch, SetStateAction } from 'react';
import type { AuthState } from '@Interfaces/domain/auth.interface';

export interface UserStorageService {
  authState: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
}

export interface SearchStorageService {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

export interface RecipeStorageService {
  sortRecipes: string;
  setSortRecipes: Dispatch<SetStateAction<string>>;
}
