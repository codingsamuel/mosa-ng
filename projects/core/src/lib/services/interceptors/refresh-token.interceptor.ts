import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { mergeMap, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { ApiService } from '../api.service';
import { ITokenSettings } from '../../models/token-settings.model';

export function refreshTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const apiService = inject(ApiService);

    return next(req).pipe(
        catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse && err?.status === 401) {
                return apiService.refreshToken(apiService.getRefreshTokenUrl(), apiService.getToken())
                    .pipe(mergeMap(() => next(updateHeader(req, apiService))));
            }
            return throwError(() => err);
        }),
    );
}

function updateHeader(req: HttpRequest<unknown>, apiService: ApiService): HttpRequest<unknown> {
    const authToken: ITokenSettings | null = apiService.getToken();
    req = req.clone({
        headers: req.headers.set('Authorization', `${authToken?.tokenType} ${authToken?.accessToken}`),
    });
    return req;
}
