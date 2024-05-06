import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { MOSA_FALLBACK_TRANSLATION, MOSA_MERGED_TRANSLATION } from '../../constants/local-storage.constant';
import { IKeyMap } from '../../models/key-map.model';
import { isNullOrEmpty, tryJsonParse } from '../../utils/commons.util';

@Injectable({
    providedIn: 'root',
})
export class CustomTranslateLoaderService {

    public getTranslation(lang: string): Observable<IKeyMap<string>> {
        return new Observable<IKeyMap<string>>((observer: Observer<IKeyMap<string>>) => {
            const item: string = localStorage.getItem(MOSA_MERGED_TRANSLATION(lang));
            const responseObj: IKeyMap<string> = tryJsonParse(item, () => this.loadFallbackLanguage());

            observer.next(responseObj);
            observer.complete();
        });
    }

    private loadFallbackLanguage(): IKeyMap<string> {
        const defaultTranslation: string = localStorage.getItem(MOSA_FALLBACK_TRANSLATION);
        return isNullOrEmpty(defaultTranslation) ? {} : JSON.parse(defaultTranslation);
    }

}
