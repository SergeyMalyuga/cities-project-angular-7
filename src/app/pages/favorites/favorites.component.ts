import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {AppRoute, CITIES} from '../../core/constants/const';
import {OffersByCity} from '../../core/types/offers-by-city.type';
import {Store} from '@ngrx/store';
import {AppState} from '../../core/models/app.state';
import {selectFavoriteOffers} from '../../store/favorite-offer/selectors/favorite-offers.selectors';
import {CityName} from '../../core/types/city-name.type';
import {NgClass} from '@angular/common';
import {OfferCardComponent} from '../../shared/components/offer-card/offer-card.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [HeaderComponent, NgClass, OfferCardComponent, RouterLink],
  templateUrl: './favorites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  private store = inject(Store<AppState>);
  private favoriteOffers = this.store.selectSignal(selectFavoriteOffers);

  public isEmptyPage = computed(() => this.favoriteOffers().length === 0);

  public offers = computed<OffersByCity>(() => {
    const offersByCity = this.createEmptyOffersByCity();
    const offers = this.favoriteOffers();
    offers.forEach(offer => {
      const key = offer.city.name;
      if (this.isKeyOfOffersByCity(key)) {
        offersByCity[key].push(offer);
      }
    })
    return offersByCity;
  });

  public isKeyOfOffersByCity(key: string): key is keyof OffersByCity {
    return CITIES.includes(key as CityName);
  }

  private createEmptyOffersByCity() {
    return CITIES.reduce((acc, city) => {
      acc[city] = [];
      return acc;
    }, {} as OffersByCity);
  }

  protected readonly CITIES = CITIES;
  protected readonly AppRoute = AppRoute;
}
