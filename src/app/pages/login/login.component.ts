import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AppRoute, AuthorizationStatus} from '../../core/constants/const';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Credentials} from '../../core/models/credentials';
import {Store} from '@ngrx/store';
import {AppState} from '../../core/models/app.state';
import {login} from '../../store/user/actions/user.actions';
import {selectAuthStatus} from '../../store/user/selectors/user.selector';
import {first} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {loadOffers} from '../../store/offer/actions/offer.actions';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store<AppState>);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  protected readonly AppRoute = AppRoute;

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$')]],
  });

  public get emailControl() {
    return this.loginForm.get('email');
  }

  public get passwordControl() {
    return this.loginForm.get('password');
  }

  public ngOnInit(): void {
    this.store.select(selectAuthStatus)
      .pipe(first(status => status === AuthorizationStatus.AUTH),
        takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loginForm.reset();
        this.store.dispatch(loadOffers());
        this.router.navigate([AppRoute.MAIN]);
      })
  }

  public onSubmit(): void {
    if (this.loginForm.valid) {
      const {email, password} = this.loginForm.value;
      const credentials: Credentials = {email, password};
      this.store.dispatch(login({credentials}));
    }
  }
}
