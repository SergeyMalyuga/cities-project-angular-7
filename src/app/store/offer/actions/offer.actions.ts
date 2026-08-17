import { createAction, props } from '@ngrx/store';
import { OfferPreview } from '../../../core/models/offers';
import { HttpErrorResponse } from '@angular/common/http';

export const loadOffers = createAction('[Offer] Load Offers');
export const loadOffersSuccess = createAction(
  '[Offer] Load Offer Success',
  props<{ offers: OfferPreview[] }>(),
);
export const loadOffersFailure = createAction(
  '[Offer] Load Offer Failure',
  props<{ error: HttpErrorResponse }>(),
);
