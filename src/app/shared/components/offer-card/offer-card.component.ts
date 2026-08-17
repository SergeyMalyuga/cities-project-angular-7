import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {OfferPreview} from '../../../core/models/offers';
import {getRatingWidth} from '../../../core/utils/rating-width';
import {NgClass, TitleCasePipe} from '@angular/common';
import {HoverTrackerDirective} from '../../directives/hover-tracker.directive';
import {OfferService} from '../../../core/services/offer.service';
import {first} from 'rxjs';
import {AppRoute, FavoriteClass} from '../../../core/constants/const';
import {Store} from '@ngrx/store';
import {AppState} from '../../../core/models/app.state';
import {selectAuthStatus} from '../../../store/user/selectors/user.selector';
import {isAuth} from '../../../core/utils/auth-status';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-offer-card',
  imports: [
    TitleCasePipe,
    HoverTrackerDirective,
    NgClass,
    RouterLink
  ],
  templateUrl: './offer-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferCardComponent {
  @Input({required: true}) offer!: OfferPreview;
  @Output() hovered = new EventEmitter<OfferPreview | null>();

  private offerService = inject(OfferService);
  private store = inject(Store<AppState>);

  protected readonly isAuth = isAuth;
  protected readonly getRatingWidth = getRatingWidth;

  public isLoading = signal<boolean>(false);
  public authStatus = this.store.selectSignal(selectAuthStatus);

  public onHovered(isHover: boolean): void {
    if (isHover) {
      return this.hovered.emit(this.offer);
    }
    return this.hovered.emit(null);
  }

  public toggleFavoriteOffer() {
    this.isLoading.set(true);
    this.offerService.toggleFavorite(this.offer.id, this.offer.isFavorite)
      .pipe(first(success => success !== null)).subscribe(() =>
      this.isLoading.set(false)
    );
  }

  protected readonly AppRoute = AppRoute;
}
