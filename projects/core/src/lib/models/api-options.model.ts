import { HttpParams } from '@angular/common/http';

export type ApiResponseTypes = 'json' | 'blob' | 'text' | 'arraybuffer';

export type ApiObserveTypes = 'body' | 'response' | 'events';

export interface IHttpOptions {
    observe?: ApiObserveTypes;
    responseType?: ApiResponseTypes;
    params?: HttpParams | Record<string, string | string[]>;
    reportProgress?: boolean;
}

export interface IApiOptions {
    skipAuth?: boolean;
    skipRefreshToken?: boolean;
    skipContentType?: boolean;
    skipErrorHandling?: boolean;
    httpOptions?: IHttpOptions;
}
