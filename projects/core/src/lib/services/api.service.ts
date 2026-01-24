import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IApiOptions } from '../models/api-options.model';
import { ITokenSettings } from '../models/token-settings.model';
import { CoreLoggerService } from './core-logger.service';
import { isNullOrEmpty } from '../utils/commons.util';
import { IApiResult } from '../models/api-result.model';

export const LOCAL_STORAGE_TOKEN_KEY = 'tokenSettings';

@Injectable({
    providedIn: 'root',
})
export class ApiService {

    private refreshTokenUrl: string = '/api/auth/token/refresh';

    private readonly myCoreLoggerService: CoreLoggerService = inject(CoreLoggerService);
    private readonly myHttpClient: HttpClient = inject(HttpClient);

    /**
     * Sets the token
     * @param tokenSettings
     */
    public setToken(tokenSettings: ITokenSettings): void {
        window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, JSON.stringify(tokenSettings));
    }

    /**
     * Gets token
     */
    public getToken(): ITokenSettings | null {
        const tokenSettings: string | null = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
        if (isNullOrEmpty(tokenSettings)) {
            return null;
        }

        return JSON.parse(tokenSettings!);
    }

    /**
     * Deletes token
     */
    public deleteToken(): void {
        window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    }

    public setRefreshTokenUrl(url: string): void {
        this.refreshTokenUrl = url;
    }

    public getRefreshTokenUrl(): string {
        return this.refreshTokenUrl;
    }

    public refreshToken<T>(url: string, data?: T, headers?: HttpHeaders, options?: IApiOptions): Observable<IApiResult<ITokenSettings>> {
        options = ApiService.serializeOptions(options);
        headers = this.getHeaders(headers, options);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.myHttpClient.post<IApiResult<ITokenSettings>>(url, data, { ...options.httpOptions as any, headers })
            .pipe(
                map((response: HttpEvent<IApiResult<ITokenSettings>>) => this.handleResponse(response)),
                tap((res: IApiResult<ITokenSettings>) => this.setToken({ ...this.getToken()!, ...res.data })),
                catchError((err: HttpErrorResponse): Observable<never> => this.handleError(err, options)),
            );
    }

    /**
     * Makes an http get call
     * @param url
     * @param headers
     * @param options
     */
    public get<T>(url: string, headers?: HttpHeaders, options?: IApiOptions): Observable<T> {
        options = ApiService.serializeOptions(options);
        headers = this.getHeaders(headers, options);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.myHttpClient.get<T>(url, { ...options.httpOptions as any, headers })
            .pipe(
                // switchMap(() => ,
                map((response: HttpEvent<T>) => this.handleResponse(response)),
                catchError((err: HttpErrorResponse): Observable<never> => this.handleError(err, options)),
            );
    }

    /**
     * Makes an async http get call, which also includes the response headers
     * @param url
     * @param headers
     * @param options
     */
    public async getWithHeadersAsync<T>(url: string, headers?: HttpHeaders, options?: IApiOptions): Promise<HttpEvent<T>> {
        return firstValueFrom(this.getWithHeaders<T>(url, headers, options));
    }

    /**
     * Makes an http get call, which also includes the response headers
     * @param url
     * @param headers
     * @param options
     */
    public getWithHeaders<T>(url: string, headers?: HttpHeaders, options?: IApiOptions): Observable<HttpEvent<T>> {
        options = ApiService.serializeOptions(options);
        headers = this.getHeaders(headers, options);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.myHttpClient.get<T>(url, { ...options.httpOptions as any, headers, observe: 'response' })
            .pipe(
                catchError((err: HttpErrorResponse): Observable<never> => this.handleError(err, options)),
            );
    }

    /**
     * Makes an http patch call (For partial updates)
     * @param url
     * @param data
     * @param headers
     * @param options
     */
    public patch<T, T1>(url: string, data?: T, headers?: HttpHeaders, options?: IApiOptions): Observable<T1> {
        options = ApiService.serializeOptions(options);
        headers = this.getHeaders(headers, options);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.myHttpClient.patch<T1>(url, data, { ...options.httpOptions as any, headers })
            .pipe(
                map((response: HttpEvent<T1>) => this.handleResponse(response)),
                catchError((err: HttpErrorResponse): Observable<never> => this.handleError(err, options)),
            );
    }

    /**
     * Makes an http put call
     * @param url
     * @param data
     * @param headers
     * @param options
     */
    public put<T, T1>(url: string, data?: T, headers?: HttpHeaders, options?: IApiOptions): Observable<T1> {
        options = ApiService.serializeOptions(options);
        headers = this.getHeaders(headers, options);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.myHttpClient.put<T1>(url, data, { ...options.httpOptions as any, headers })
            .pipe(
                map((response: HttpEvent<T1>) => this.handleResponse(response)),
                catchError((err: HttpErrorResponse): Observable<never> => this.handleError(err, options)),
            );
    }

    /**
     * Makes an http post call
     * @param url
     * @param data
     * @param headers
     * @param options
     */
    public post<T, T1>(url: string, data?: T, headers?: HttpHeaders, options?: IApiOptions): Observable<T1> {
        options = ApiService.serializeOptions(options);
        headers = this.getHeaders(headers, options);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.myHttpClient.post<T1>(url, data, { ...options.httpOptions as any, headers })
            .pipe(
                map((response: HttpEvent<T1>) => this.handleResponse(response)),
                catchError((err: HttpErrorResponse): Observable<never> => this.handleError(err, options)),
            );
    }

    /**
     * makes an http delete call
     * @param url
     * @param headers
     * @param options
     * @returns Observable
     */
    public delete<T>(url: string, headers?: HttpHeaders, options?: IApiOptions): Observable<T> {
        options = ApiService.serializeOptions(options);
        headers = this.getHeaders(headers, options);
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        return this.myHttpClient.delete<T>(url, { ...options.httpOptions as {}, headers })
            .pipe(
                catchError((err: HttpErrorResponse): Observable<never> => this.handleError(err, options)),
            );
    }

    /**
     * Appends a script to the html body
     * @param path
     * @param attributes
     * @param onLoad
     */
    public loadExternalScript(path: string, attributes?: { key: string, value: string }[],
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              onLoad?: ((this: GlobalEventHandlers, ev: Event) => any)): void {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = path;
        script.async = true;

        if (onLoad) {
            script.onload = onLoad;
        }

        if (attributes) {
            for (const attribute of attributes) {
                script.setAttribute(attribute.key, attribute.value);
            }
        }

        document.body.append(script);
    }

    private handleError(err: HttpErrorResponse, options: IApiOptions): Observable<never> {
        if (!options?.skipErrorHandling) {
            void this.myCoreLoggerService.logError({ msg: err });
        }

        return throwError(() => err);
    }

    private handleResponse<T>(response: HttpEvent<T>): T {
        if (response instanceof HttpResponse) {
            return response.body as T;
        }
        return response as T;
    }

    private getHeaders(headers?: HttpHeaders, options?: IApiOptions): HttpHeaders {
        if (!headers) {
            headers = new HttpHeaders();
        }

        if (!options?.skipContentType) {
            if (!headers.get('Content-Type')) {
                headers = headers.set('Content-Type', 'application/json');
            }
        }

        const tokenSettings: ITokenSettings | null = this.getToken();
        if (!options?.skipAuth && tokenSettings) {
            headers = headers.set('Authorization', `${tokenSettings.tokenType} ${tokenSettings.accessToken}`);
        }
        return headers;
    }

    private static serializeOptions(options?: IApiOptions): IApiOptions {
        if (!options) {
            options = {};
        }

        if (!options.httpOptions) {
            options.httpOptions = {};
        }

        return options;
    }
}
