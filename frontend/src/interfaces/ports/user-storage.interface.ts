import { Dispatch, SetStateAction } from 'react';
import { AuthState } from '@Interfaces/domain/auth.interface';

export interface UserStorageService {
  authState?: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
}
