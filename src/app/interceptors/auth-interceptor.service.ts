import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('refresh-token')) {
        return authService.refreshToken().pipe(
          switchMap((isTokenRefreshed) => {
            if (isTokenRefreshed) {
              // Retry the request once after token refresh
              return next(req);
            } else {
              setTimeout(() => router.navigate(['/welcome']), 0); // Ensuring navigation outside observable
              return throwError(() => new Error('User logged out'));
            }
          }),
          catchError(() => {
            // If refresh itself fails, navigate to welcome page
            setTimeout(() => router.navigate(['/welcome']), 0);
            return throwError(() => new Error('Token refresh failed'));
          })
        );
      }
      return throwError(() => error);
    })
  );
};
