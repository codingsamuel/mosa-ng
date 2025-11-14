import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, share, tap } from 'rxjs/operators';
import { getRandomString } from '../../utils/commons.util';
import { TranslateCollectorService } from './translate-collector.service';

@Injectable({
    providedIn: 'root',
})
export class AssetsI18nLoaderService {

    protected priority: number = 0;
    protected supportedLanguages: string[];

    private subLanguages: Observable<{ languages: string[] }>;

    constructor(
        protected myHttpClient: HttpClient,
        protected myTranslateCollectorService: TranslateCollectorService,
    ) {
    }

    public init(path?: string, libName?: string, priority?: number): Promise<void> {
        return new Promise(async (resolve: () => void): Promise<void> => {
            if (this.supportedLanguages) {
                for (let i: number = 0; i < this.supportedLanguages.length; i++) {
                    await firstValueFrom(this.loadTranslations(this.supportedLanguages[ i ], path, libName, priority));
                }
                resolve();
                return;
            }

            if (!this.subLanguages) {
                this.subLanguages = this.myHttpClient.get<{ languages: string[] }>(`assets/i18n/supported-languages.json?v=${getRandomString()}`)
                    .pipe(share());
            }
            this.subLanguages.subscribe(async (res: { languages: string[] }) => {
                this.subLanguages = null;
                this.supportedLanguages = res.languages;

                for (let i: number = 0; i < this.supportedLanguages.length; i++) {
                    await firstValueFrom(this.loadTranslations(this.supportedLanguages[ i ], path, libName, priority));
                }
                resolve();
            }, () => {
                this.subLanguages = null;
                console.error('Missing file -> assets/i18n/supported-languages.json <-- FIX THIS!');
                resolve();
            });
        });
    }

    protected loadTranslations(lang: string, path?: string, libName?: string, priority?: number): Observable<Record<string, string>> {
        const filename: string = libName ? `${libName}-${lang}.json` : `${lang}.json`;
        return this.myHttpClient.get<Record<string, string>>(`${(path || './assets/i18n/') + filename}?v=${getRandomString()}`)
            .pipe(
                tap((response: Record<string, string>) =>
                    this.myTranslateCollectorService.addTranslations(response, lang, priority || this.priority)),
                catchError(() => {
                    console.error(`Missing file -> ${filename} <-- FIX THIS!`);
                    return of(null);
                }),
            );
    }
}
