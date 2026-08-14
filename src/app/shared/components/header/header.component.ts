import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AppState} from '../../../core/models/app.state';
import {Store} from '@ngrx/store';
import {selectAuthStatus} from '../../../store/user/selectors/user.selector';
import {isAuth} from '../../../core/utils/auth-status';
import {AppRoute} from '../../../core/constants/const';
import {RouterLink} from '@angular/router';
import {logout} from '../../../store/user/actions/user.actions';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private store = inject(Store<AppState>);

  protected readonly isAuth = isAuth;
  protected readonly AppRoute = AppRoute;

  public authStatus = this.store.selectSignal(selectAuthStatus);

  public logout() {
    if (this.isAuth(this.authStatus())) {
      this.store.dispatch(logout());
    }
  }
}
