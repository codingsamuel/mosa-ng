import { CommonModule } from '@angular/common';
import { inject, ModuleWithProviders, NgModule, provideAppInitializer } from '@angular/core';
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
                provideAppInitializer(() => {
        const initializerFn = (initI18n)(inject(AssetsI18nLoaderService));
        return initializerFn();
      }),
            ],
        };
    }

}
