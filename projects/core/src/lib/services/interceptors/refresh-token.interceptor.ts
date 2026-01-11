import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { mergeMap, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { ApiService } from '../api.service';
import { ITokenSettings } from '../../models/token-settings.model';

export function refreshTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const apiService = inject(ApiService);

    return next(req).pipe(
        catchError((err) => {
            if (err instanceof HttpErrorResponse) {
                if (err?.status === 401) {
                    return apiService.refreshToken(apiService.getRefreshTokenUrl(), { refreshToken: apiService.getToken()?.refreshToken, accessToken: apiService.getToken()?.accessToken, tokenType: apiService.getToken()?.tokenType })
                        .pipe(mergeMap(() => next(updateHeader(req, apiService))));
                }
            }
            return throwError(() => err);
        }),
    );
}

function updateHeader(req: any, myApiService: any): HttpRequest<any> {
    const authToken: ITokenSettings = myApiService.getToken();
    req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken?.accessToken}`),
    });
    return req;
}
