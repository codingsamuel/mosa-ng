import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { MOSA_FALLBACK_TRANSLATION, MOSA_MERGED_TRANSLATION } from '../../constants/local-storage.constant';
import { IKeyMap } from '../../models/key-map.model';
import { isNullOrEmpty, tryJsonParse } from '../../utils/commons.util';

@Injectable({
    providedIn: 'root',
})
export class CustomTranslateLoaderService {

    public getTranslation(lang: string): Observable<IKeyMap<string> | null> {
        return new Observable<IKeyMap<string> | null>((observer: Observer<IKeyMap<string> | null>) => {
            const item: string | null = localStorage.getItem(MOSA_MERGED_TRANSLATION(lang));
            const responseObj: IKeyMap<string> | null = tryJsonParse(item, () => this.loadFallbackLanguage());

            observer.next(responseObj);
            observer.complete();
        });
    }

    private loadFallbackLanguage(): IKeyMap<string> {
        const defaultTranslation: string | null = localStorage.getItem(MOSA_FALLBACK_TRANSLATION);
        return isNullOrEmpty(defaultTranslation) ? {} : JSON.parse(defaultTranslation!);
    }

}
