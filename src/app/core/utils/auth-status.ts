import {AuthorizationStatus} from '../constants/const';

export function isAuth(authStatus: AuthorizationStatus): boolean {
  return authStatus === AuthorizationStatus.AUTH;
}
