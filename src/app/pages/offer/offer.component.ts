import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Offer, OfferPreview} from '../../core/models/offers';
import {
  catchError,
  combineLatest,
  EMPTY,
  filter, first,
  map,
  merge,
  of,
  Subject,
  switchMap, tap,
} from 'rxjs';
import {OfferDataService} from '../../core/services/offer-data.service';
import {AppRoute, QUANTITY_FIRST_OFFERS} from '../../core/constants/const';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {LoaderComponent} from '../../shared/components/loader/loader.component';
import {getRatingWidth} from '../../core/utils/rating-width';
import {DatePipe, NgClass, SlicePipe, TitleCasePipe} from '@angular/common';
import {Comment} from '../../core/models/comments';
import {CommentService} from '../../core/services/comment.service';
import {CommentFormComponent} from '../../components/comment-form/comment-form.component';
import {SortByDatePipe} from '../../shared/pipes/sort-by-date.pipe';
import {MapComponent} from '../../shared/components/map/map.component';
import {OfferCardComponent} from '../../shared/components/offer-card/offer-card.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../core/models/app.state';
import {selectAuthStatus} from '../../store/user/selectors/user.selector';
import {isAuth} from '../../core/utils/auth-status';
import {OfferService} from '../../core/services/offer.service';
import {ScrollUpDirective} from '../../shared/directives/scroll-up.directive';

@Component({
  selector: 'app-offer',
  imports: [
    HeaderComponent,
    LoaderComponent,
    TitleCasePipe,
    DatePipe,
    CommentFormComponent,
    SortByDatePipe,
    MapComponent,
    SlicePipe,
    OfferCardComponent,
    NgClass,
    ScrollUpDirective,
  ],
  templateUrl: './offer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private offerDataService = inject(OfferDataService);
  private offerService = inject(OfferService);
  private commentService = inject(CommentService);
  private destroyRef = inject(DestroyRef);
  private store = inject(Store<AppState>);

  protected readonly getRatingWidth = getRatingWidth;
  protected readonly QUANTITY_FIRST_OFFERS = QUANTITY_FIRST_OFFERS;
  protected readonly isAuth = isAuth;

  public offer = signal<Offer | null>(null);
  private refreshOffer$ = new Subject<void>();

  public comments = signal<Comment[]>([]);
  public refreshComment$ = new Subject<void>();

  public nearbyOffers = signal<OfferPreview[]>([]);
  public refreshNearbyOffer$ = new Subject<void>();

  public offerId = computed<string | null>(() => this.offer()?.id ?? null);
  public authStatus = this.store.selectSignal(selectAuthStatus);
  public isLoading = signal<boolean>(false);

  public ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter((id): id is string => id !== null),
        switchMap((id) => {
          const offer$ = merge(
            this.offerDataService.getOfferById(id),
            this.refreshOffer$.pipe(
              switchMap(() =>
                this.offerDataService.getOfferById(id).pipe(
                  catchError(() => {
                    this.router.navigate([AppRoute.MAIN]);
                    return EMPTY;
                  }),
                ),
              ),
            ),
          );

          const comments$ = merge(
            this.commentService.getComments(id),
            this.refreshComment$.pipe(
              switchMap(() =>
                this.commentService
                  .getComments(id)
                  .pipe(catchError(() => of([]))),
              ),
            ),
          );

          const nearbyOffers$ = merge(
            this.offerDataService.getNearbyOffers(id),
            this.refreshNearbyOffer$.pipe(switchMap(() =>
              this.offerDataService.getNearbyOffers(id).pipe(catchError(() => of([]))))));


          return combineLatest({
            offer: offer$,
            comments: comments$,
            nearbyOffers: nearbyOffers$,
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.offer.set(result.offer);
        this.comments.set(result.comments);
        this.nearbyOffers.set(result.nearbyOffers);
        this.isLoading.set(false);
      });
  }

  public toggleFavoriteOffer() {
    const offer = this.offer();
    if (offer) {
      this.isLoading.set(true);
      this.offerService.toggleFavorite(offer.id, offer.isFavorite)
        .pipe(first(status => status !== null),
          tap((status) => {
            if (status) {
              this.refreshOffer$.next();
            } else {
              this.isLoading.set(false);
            }
          }),
          catchError(() => {
            this.isLoading.set(false);
            return EMPTY;
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  public refreshComments(): void {
    this.refreshComment$.next();
  }

  public refreshNearbyOffers(): void {
    this.refreshNearbyOffer$.next();
  }
}
