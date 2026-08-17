import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../core/models/app.state';
import {selectAuthStatus} from '../store/user/selectors/user.selector';
import {toggleFavoriteOffer} from '../store/favorite-offer/actions/favorite-offer.actions';
import {selectFavoriteOfferSuccessStatus} from '../store/favorite-offer/selectors/favorite-offers.selectors';
import {EMPTY} from 'rxjs';
import {Router} from '@angular/router';
import {AppRoute} from '../core/constants/const';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private authStatus = this.store.selectSignal(selectAuthStatus);

  public toggleFavorite(offerId: string, isFavorite: boolean) {
    if (this.authStatus()) {
      this.store.dispatch(toggleFavoriteOffer({offerId, isFavorite: !isFavorite}));
      return this.store.select(selectFavoriteOfferSuccessStatus);
    }
    this.router.navigate([AppRoute.LOGIN]);
    return EMPTY;
  }
}
