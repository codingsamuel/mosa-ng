import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
    const translate: TranslateService = inject(TranslateService);
    const lang: string = translate.getCurrentLang() || 'en-US';

    // Clone the request to add the Accept-Language header
    const authReq = req.clone({
        setHeaders: {
            'Accept-Language': lang
        }
    });

    return next(authReq);
};
