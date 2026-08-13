import {UserState} from '../../core/models/user.state';
import {AuthorizationStatus, DEFAULT_USER} from '../../core/constants/const';
import {createReducer} from '@ngrx/store';

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.UNKNOWN,
  user: DEFAULT_USER,
  isLoading: false,
  error: null,
}

export const userReducer = createReducer(initialState);
