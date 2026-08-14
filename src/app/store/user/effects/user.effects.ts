import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {UserService} from '../../../services/user.service';
import * as UserActions from '../actions/user.actions';
import {AuthService} from '../../../services/auth.service';
import {catchError, map, of, switchMap} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  public checkAuth$ = createEffect(() =>
    this.actions$.pipe(ofType(UserActions.checkAuth), switchMap(() => {
      const token = this.authService.getToken();
      if (token) {
        this.userService.checkAuth().pipe(map(user => UserActions.checkAuthSuccess({user})),
          catchError((error: HttpErrorResponse) => of(UserActions.checkAuthFailure(error))))
      }
      return of(UserActions.checkAuthFailure({error: 'Unauthorized'}));
    })));

  public login$ = createEffect(() =>
    this.actions$.pipe(ofType(UserActions.login), switchMap(({credentials}) =>
      this.userService.login(credentials)
        .pipe(map(user => UserActions.loginSuccess({user})),
          catchError((error: HttpErrorResponse) => of(UserActions.loginFailure({error})))))));
}
