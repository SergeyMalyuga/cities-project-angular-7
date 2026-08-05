import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

export function httpErrorHandler(err: HttpErrorResponse): Observable<never> {
  console.error(err.message);
  return throwError(() => err.message);
}
