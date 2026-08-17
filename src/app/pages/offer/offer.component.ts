import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Offer} from '../../core/models/offers';
import {catchError, combineLatest, EMPTY, filter, map, merge, Subject, switchMap} from 'rxjs';
import {OfferDataService} from '../../services/offer-data.service';
import {AppRoute} from '../../core/constants/const';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {LoaderComponent} from '../../shared/components/loader/loader.component';
import {getRatingWidth} from '../../core/utils/rating-width';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-offer',
  imports: [
    HeaderComponent,
    LoaderComponent,
    TitleCasePipe
  ],
  templateUrl: './offer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private offerDataService = inject(OfferDataService);
  private destroyRef = inject(DestroyRef);

  public offer = signal<Offer | null>(null);
  private refreshOffer$ = new Subject<void>();

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
        )
        return combineLatest({
          offer: offer$
        })
      }), takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      this.offer.set(result.offer);
    });
  }

  protected readonly getRatingWidth = getRatingWidth;
}
