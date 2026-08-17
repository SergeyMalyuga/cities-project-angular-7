import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadOffers } from './store/offer/actions/offer.actions';
import { checkAuth } from './store/user/actions/user.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private store = inject(Store);

  public ngOnInit(): void {
    this.store.dispatch(checkAuth());
    this.store.dispatch(loadOffers());
  }
}
