import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { first, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import { selectAuthStatus } from '../../store/user/selectors/user.selector';
import { AppRoute, AuthorizationStatus } from '../constants/const';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private store = inject(Store<AppState>);
  private destroyRef = inject(DestroyRef);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    return this.store.select(selectAuthStatus).pipe(
      first((authStatus) => authStatus !== AuthorizationStatus.UNKNOWN),
      map((authStatus) => {
        if (authStatus === AuthorizationStatus.AUTH) {
          return true;
        }
        return this.router.createUrlTree([AppRoute.LOGIN], {
          queryParams: { redirectTo: state.url },
        });
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }
}
