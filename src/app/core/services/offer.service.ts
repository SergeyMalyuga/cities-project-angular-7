import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../models/app.state';
import {selectAuthStatus} from '../../store/user/selectors/user.selector';
import {toggleFavoriteOffer} from '../../store/favorite-offer/actions/favorite-offer.actions';
import {selectFavoriteOfferSuccessStatus} from '../../store/favorite-offer/selectors/favorite-offers.selectors';
import {Router} from '@angular/router';
import {AppRoute, AuthorizationStatus} from '../constants/const';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private authStatus = this.store.selectSignal(selectAuthStatus);

  public toggleFavorite(offerId: string, isFavorite: boolean) {
    if (this.authStatus() === AuthorizationStatus.AUTH) {
      this.store.dispatch(toggleFavoriteOffer({offerId, isFavorite: !isFavorite}));
    } else {
      this.router.navigate([AppRoute.LOGIN]);
    }
    return this.store.select(selectFavoriteOfferSuccessStatus);
  }
}
