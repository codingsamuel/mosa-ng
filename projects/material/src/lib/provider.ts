import { AssetsI18nLoaderService } from '@mosa-ng/core';
import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

// Components
export * from './components/alert-widget/alert.widget';
export * from './components/base/cell-editor.base.component';
export * from './components/cell-editor/cell-editor.component';
export * from './components/confirm-dialog/confirm.dialog';
export * from './components/loading-button/loading-button.component';
export * from './components/logger/logger.component';
export * from './components/skeleton-loader/skeleton/skeleton.component';
export * from './components/skeleton-loader/list-skeleton-loader/list.skeleton-loader';
export * from './components/skeleton-loader/table-skeleton-loader/table.skeleton-loader';
export * from './components/update-dialog/mat-update-dialog/mat-update.dialog';
export * from './components/update-dialog/update.dialog';

// Directives
export * from './directives/cell-editor.directive';
export * from './directives/click-outside.directive';

// States
export * from './models/states/logger-state.model';
export * from './models/states/cell-editor-base-state.model';

// Models
export * from './models/skeleton.model';
export * from './models/confirm-dialog.model';
export * from './models/table-item.model';
export * from './models/update-config.model';

// Services
export * from './services/cell-editor.service';
export * from './services/logger.service';

export * from './services/facades/logger.facade';

function initI18n(i18n: AssetsI18nLoaderService): Promise<void> {
    return i18n.init(undefined, 'mosa');
}

export const provideMosaMaterial: () => EnvironmentProviders = () => makeEnvironmentProviders([
    provideAppInitializer(() => initI18n(inject(AssetsI18nLoaderService))),
]);
