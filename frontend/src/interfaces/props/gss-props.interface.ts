import { NormalizedCacheObject } from '@apollo/client';
import { AuthState } from '@Interfaces/domain/auth.interface';

export interface AuthProps extends AuthState {}

export interface GSSProps {
  authProps?: AuthProps;
  lostAuth?: boolean;
  componentProps?: any;
  apolloCache?: NormalizedCacheObject;
}
