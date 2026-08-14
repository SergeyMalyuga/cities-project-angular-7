import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AppState} from '../../../core/models/app.state';
import {Store} from '@ngrx/store';
import {selectAuthStatus} from '../../../store/user/selectors/user.selector';
import {isAuth} from '../../../core/utils/auth-status';
import {AppRoute} from '../../../core/constants/const';
import {RouterLink} from '@angular/router';

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

  public authStatus = this.store.selectSignal(selectAuthStatus);
  protected readonly isAuth = isAuth;
  protected readonly AppRoute = AppRoute;
}
