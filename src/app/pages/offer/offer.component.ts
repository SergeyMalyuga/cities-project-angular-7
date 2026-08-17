import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Offer} from '../../core/models/offers';
import {catchError, combineLatest, EMPTY, filter, map, merge, of, Subject, switchMap} from 'rxjs';
import {OfferDataService} from '../../core/services/offer-data.service';
import {AppRoute} from '../../core/constants/const';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {LoaderComponent} from '../../shared/components/loader/loader.component';
import {getRatingWidth} from '../../core/utils/rating-width';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {Comment} from '../../core/models/comments';
import {CommentService} from '../../core/services/comment.service';
import {CommentFormComponent} from '../../components/comment-form/comment-form.component';
import {SortByDatePipe} from '../../shared/pipes/sort-by-date.pipe';

@Component({
  selector: 'app-offer',
  imports: [
    HeaderComponent,
    LoaderComponent,
    TitleCasePipe,
    DatePipe,
    CommentFormComponent,
    SortByDatePipe
  ],
  templateUrl: './offer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private offerDataService = inject(OfferDataService);
  private commentService = inject(CommentService);
  private destroyRef = inject(DestroyRef);

  protected readonly getRatingWidth = getRatingWidth;

  public offer = signal<Offer | null>(null);
  private refreshOffer$ = new Subject<void>();

  public comments = signal<Comment[]>([]);
  public refreshComment$ = new Subject<void>();

  public offerId = computed<string | null>(() => this.offer()?.id ?? null);

  public ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(map(params => params.get('id')),
      filter((id): id is string => id !== null), switchMap((id) => {
        const offer$ = merge(
          this.offerDataService.getOfferById(id),
          this.refreshOffer$.pipe(switchMap(() => this.offerDataService.getOfferById(id)
            .pipe(catchError(() => {
              this.router.navigate([AppRoute.MAIN]);
              return EMPTY;
            }))
          ))
        );

        const comments$ = merge(
          this.commentService.getComments(id),
          this.refreshComment$.pipe(switchMap(() => this.commentService.getComments(id)
            .pipe(catchError(() => of([]))))))

        return combineLatest({
          offer: offer$,
          comments: comments$
        })
      }), takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      this.offer.set(result.offer);
      this.comments.set(result.comments);
    });
  }

  public refreshComments(): void {
    this.refreshComment$.next();
  }
}
