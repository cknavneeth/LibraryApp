import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../../services/userService/authService/auth.service';
import { inject, Inject } from '@angular/core';
import { catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';

export const authinterceptorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  const token = localStorage.getItem('access_token');

  let modifiedReq = req.clone({
    withCredentials: true,
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh')) {
        if (!authService.isRefreshing) {
          authService.isRefreshing = true;

          return authService.refreshToken().pipe(
            switchMap(() => {
              authService.isRefreshing = false;
              authService.refreshSubject.next(true);

              const newToken = localStorage.getItem('access_token');

              const retryReq = req.clone({
                withCredentials: true,
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });

              return next(retryReq);
            }),
            catchError((err: HttpErrorResponse) => {
              authService.isRefreshing = false;
              authService.refreshSubject.next(false);

              authService.logout();
              return throwError(() => err);
            })
          );
        } else {
          return authService.refreshSubject.pipe(
            filter(status => status === true),
            take(1),
            switchMap(() => {
              const newToken = localStorage.getItem('access_token');

              const retryReq = req.clone({
                withCredentials: true,
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });

              return next(retryReq);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
