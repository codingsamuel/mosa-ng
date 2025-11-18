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

    constructor(
        protected myHttpClient: HttpClient,
        protected myTranslateCollectorService: TranslateCollectorService,
    ) {
    }

    public async init(path?: string, libName?: string, priority?: number): Promise<void> {
        if (this.supportedLanguages.length > 0) {
            for (let i: number = 0; i < this.supportedLanguages.length; i++) {
                await firstValueFrom(this.loadTranslations(this.supportedLanguages[ i ], path, libName, priority));
            }
            return;
        }

        const res: { languages: string[] } | null = await firstValueFrom(this.myHttpClient.get<{ languages: string[] }>(`assets/i18n/supported-languages.json?v=${getRandomString()}`)).catch(() => null);
        if (!res) {
            console.error('Missing file -> assets/i18n/supported-languages.json');
            return;
        }

        this.supportedLanguages = res.languages;

        for (let i: number = 0; i < this.supportedLanguages.length; i++) {
            await firstValueFrom(this.loadTranslations(this.supportedLanguages[ i ], path, libName, priority));
        }
    }

    protected loadTranslations(lang: string, path?: string, libName?: string, priority?: number): Observable<Record<string, string> | null> {
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
