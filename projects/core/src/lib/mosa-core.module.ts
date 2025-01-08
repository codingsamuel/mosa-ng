import { CommonModule } from '@angular/common';
import { inject, ModuleWithProviders, NgModule, provideAppInitializer } from '@angular/core';
import { AssetsI18nLoaderService } from './services/translation/assets-i18n-loader.service';

/*
 * Public API Surface of core
 */

/**
 * Services
 */
export * from './services/api.service';
export * from './services/mosa-socket.service';
export * from './services/core-logger.service';
export * from './services/translation/translate-collector.service';
export * from './services/translation/custom-translate-loader.service';

/**
 * Guards
 */
export * from './services/guards/can-deactivate.guard';

/**
 * Models
 */
export * from './models/dictionary-item.model';
export * from './models/api-options.model';
export * from './models/mosa-duration.model';
export * from './models/token-settings.model';
export * from './models/transform-matrix.model';
export * from './models/key-map.model';

export * from './models/sieve/sieve-response.model';
export * from './models/sieve/sieve-sort.model';
export * from './models/sieve/sieve-filter.model';
export * from './models/sieve/sieve-operator.model';
export * from './models/sieve/sieve-options.model';

export * from './models/logger/logger-config.model';
export * from './models/logger/log.model';
export * from './models/logger/log-event.model';
export * from './models/logger/log-message-data.model';
export * from './models/logger/logger-base-config.model';
export * from './models/logger/logger-default-config.model';
export * from './models/logger/log-type.model';

/**
 * Utils
 */
export * from './utils/dictionary.util';
export * from './utils/prototypes.util';
export * from './utils/sieve.util';
export * from './utils/size.util';
export * from './utils/promise.util';
export * from './utils/item.util';
export * from './utils/commons.util';
export * from './services/translation/assets-i18n-loader.service';

/**
 * Enums
 */
export * from './enums/theme.enum';
export * from './enums/content-position.enum';
export * from './enums/browser.enum';
export * from './enums/i18n-supported.enum';

/**
 * Constants
 */
export * from './constants/local-storage.constant';

/**
 * Pipes
 */
export * from './pipes/mosa-date-pipe/mosa-date-pipe.module';
export * from './pipes/mosa-date-pipe/mosa-date.pipe';

export * from './pipes/dictionary-item-pipe/dictionary-item-pipe.module';
export * from './pipes/dictionary-item-pipe/dictionary-item.pipe';

export * from './pipes/mosa-duration-pipe/mosa-duration-pipe.module';
export * from './pipes/mosa-duration-pipe/mosa-duration.pipe';

export * from './pipes/find-in-array/find-in-array-pipe.module';
export * from './pipes/find-in-array/find-in-array.pipe';

export * from './pipes/join/join-pipe.module';
export * from './pipes/join/join.pipe';


export function initI18n(i18n: AssetsI18nLoaderService): () => Promise<void> {
    return () => i18n.init(null, null, 1);
}

export function initI18nCore(i18n: AssetsI18nLoaderService): () => Promise<void> {
    return () => i18n.init(null, 'mosa');
}

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
})
export class MosaCoreModule {

    public static forRoot(): ModuleWithProviders<MosaCoreModule> {
        return {
            ngModule: MosaCoreModule,
            providers: [
                provideAppInitializer(() => {
        const initializerFn = (initI18n)(inject(AssetsI18nLoaderService));
        return initializerFn();
      }),
                provideAppInitializer(() => {
        const initializerFn = (initI18nCore)(inject(AssetsI18nLoaderService));
        return initializerFn();
      }),
            ],
        };
    }

}
