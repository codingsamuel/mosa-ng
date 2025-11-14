import { AssetsI18nLoaderService } from '@mosa-ng/core';
import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

function initI18n(i18n: AssetsI18nLoaderService): Promise<void> {
    return i18n.init(null, 'mosa');
}

export const provideMosaMaterial: () => EnvironmentProviders = () => makeEnvironmentProviders([
    provideAppInitializer(() => initI18n(inject(AssetsI18nLoaderService))),
]);
