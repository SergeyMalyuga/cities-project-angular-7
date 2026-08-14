import {UserState} from '../../core/models/user.state';
import {AuthorizationStatus, DEFAULT_USER} from '../../core/constants/const';
import {createReducer, on} from '@ngrx/store';
import {checkAuth, checkAuthFailure, checkAuthSuccess, login, loginSuccess} from './actions/user.actions';
import {loadOffersFailure} from '../offer/actions/offer.actions';

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.UNKNOWN,
  user: DEFAULT_USER,
  isLoading: false,
  error: null,
}

export const userReducer = createReducer(
  initialState,
  on(checkAuth, state => ({
    ...state, isLoading: true,
  })),
  on(checkAuthSuccess, (state, {user}) => ({
    ...state, user, authorizationStatus: AuthorizationStatus.AUTH, isLoading: false, error: null
  })), on(checkAuthFailure, (state, {error}) => ({
    ...state, authorizationStatus: AuthorizationStatus.UN_AUTH, isLoading: false, error
  })),

  on(login, state => ({
    ...state, isLoading: true,
  })),
  on(loginSuccess, (state, {user}) => ({
    ...state, user, authorizationStatus: AuthorizationStatus.AUTH, isLoading: false, error: null
  })),
  on(loadOffersFailure, (state, {error}) => ({
    ...state, isLoading: false, error, authorizationStatus: AuthorizationStatus.UN_AUTH
  }))
);
