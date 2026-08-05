import {createEntityAdapter} from '@ngrx/entity';
import {OfferPreview} from '../../core/models/offers';
import {OfferState} from '../../core/models/offer-state';
import {createReducer} from '@ngrx/store';

export const offerAdapter = createEntityAdapter<OfferPreview>();
const initialState: OfferState = offerAdapter.getInitialState({
  isLoading: false,
  error: null
});

export const offerReducer = createReducer(initialState);
