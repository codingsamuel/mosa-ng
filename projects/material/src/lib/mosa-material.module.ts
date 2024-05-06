import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { AssetsI18nLoaderService } from '@mosa-ng/core';

export function initI18n(i18n: AssetsI18nLoaderService): () => Promise<void> {
    return () => i18n.init(null, 'mosa');
}

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
})
export class MosaMaterialModule {

    public static forRoot(): ModuleWithProviders<MosaMaterialModule> {
        return {
            ngModule: MosaMaterialModule,
            providers: [
                { provide: APP_INITIALIZER, useFactory: initI18n, deps: [ AssetsI18nLoaderService ], multi: true },
            ],
        };
    }

}
