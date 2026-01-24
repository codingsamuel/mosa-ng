import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { getRandomString } from '../../utils/commons.util';
import { TranslateCollectorService } from './translate-collector.service';

@Injectable({
    providedIn: 'root',
})
export class AssetsI18nLoaderService {

    protected priority: number = 0;
    protected supportedLanguages: string[] = [];

    private supportedLanguagesPromise: Promise<string[]> | null = null;

    constructor(
        protected myHttpClient: HttpClient,
        protected myTranslateCollectorService: TranslateCollectorService,
    ) {
    }

    public async init(path?: string, libName?: string, priority?: number): Promise<void> {
        const languages: string[] = await this.getSupportedLanguages();

        for (const lang of languages) {
            await firstValueFrom(this.loadTranslations(lang, path, libName, priority));
        }
    }

    private async getSupportedLanguages(): Promise<string[]> {
        // If we already have the data, return it immediately
        if (this.supportedLanguages.length > 0) {
            return this.supportedLanguages;
        }

        // If a request is already in flight, return that same promise
        if (this.supportedLanguagesPromise) {
            return this.supportedLanguagesPromise;
        }

        // Create the promise for the HTTP call
        this.supportedLanguagesPromise = (async (): Promise<string[]> => {
            const url = `assets/i18n/supported-languages.json?v=${getRandomString()}`;
            const res = await firstValueFrom(
                this.myHttpClient.get<{ languages: string[] }>(url)
            ).catch(() => null);

            if (!res?.languages) {
                this.supportedLanguagesPromise = null;
                return [];
            }

            this.supportedLanguages = res.languages;
            return res.languages;
        })();

        return this.supportedLanguagesPromise;
    }

    private loadTranslations(lang: string, path?: string, libName?: string, priority?: number): Observable<Record<string, string> | null> {
        const filename: string = libName ? `${libName}-${lang}.json` : `${lang}.json`;
        return this.myHttpClient.get<Record<string, string>>(`${(path || './assets/i18n/') + filename}?v=${getRandomString()}`)
            .pipe(
                tap((response: Record<string, string>) =>
                    this.myTranslateCollectorService.addTranslations(response, lang, priority || this.priority)),
                catchError(() => {
                    console.error(`Missing file -> ${filename}`);
                    return of(null);
                }),
            );
    }
}
