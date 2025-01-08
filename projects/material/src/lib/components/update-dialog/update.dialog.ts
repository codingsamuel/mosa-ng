import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService, isNullOrEmpty } from '@mosa-ng/core';
import { firstValueFrom, timer } from 'rxjs';
import { IUpdateConfig, IVersion, UpdateDialogResult } from '../../models/update-config.model';
import { MatUpdateDialog } from './mat-update-dialog/mat-update.dialog';

@Component({
    selector: 'mosa-update-dialog',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UpdateDialog {

    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('config')
    public set updateConfig(config: IUpdateConfig) {
        if (config) {
            if (!config.versionPath) {
                console.warn('LoggerService: No version path was provided. This field is required!');
                return;
            }

            if (!config.localStorageKey) {
                config.localStorageKey = 'mosaApplicationVersion';
            }

            if (!config.ignoreTimeout) {
                config.ignoreTimeout = 30000;
            }

            if (!config.refreshInterval) {
                config.refreshInterval = 15000;
            }

            if (!config.title) {
                config.title = 'mosa.components.updateDialog.title';
            }

            if (!config.message) {
                config.message = 'mosa.components.updateDialog.message';
            }

            this.config = config;
            this.end();
            this.start();
        } else {
            console.warn('LoggerService: Cannot check for version. No config was provided.');
        }
    }

    private firstLoad: boolean = true;

    private blocked: boolean;
    private interval: NodeJS.Timeout;
    private config: IUpdateConfig;

    constructor(
        private readonly myApiService: ApiService,
        private readonly myMatDialog: MatDialog,
    ) {
    }

    private start(): void {
        if (this.interval) {
            this.end();
        }
        void this.checkForUpdate();
        this.interval = setInterval((): Promise<void> => this.checkForUpdate(), this.config.refreshInterval);
    }

    private openDialog(version: IVersion): void {
        this.myMatDialog
            .open(MatUpdateDialog, {
                width: '600px',
                data: this.config,
            })
            .afterClosed()
            .subscribe((result: UpdateDialogResult): void => {
                switch (result) {
                    case UpdateDialogResult.cancel:
                        this.end();
                        this.blocked = true;
                        break;
                    case UpdateDialogResult.ignore:
                        timer(this.config.ignoreTimeout).subscribe((): void => {
                            this.openDialog(version);
                        });
                        break;
                    case UpdateDialogResult.reload:
                        window.location.reload();
                        window.localStorage.setItem(this.config.localStorageKey, JSON.stringify(version));
                        break;
                }
            });
    }

    private async checkForUpdate(): Promise<void> {
        if (!this.blocked) {
            const localStorageVersion: string = window.localStorage.getItem(this.config.localStorageKey);
            let localVersion: IVersion = { version: '0.0.0', timestamp: 0 };
            if (!isNullOrEmpty(localStorageVersion)) {
                localVersion = JSON.parse(localStorageVersion);
            }
            const data: IVersion = await firstValueFrom(this.myApiService.get(this.config.versionPath));
            if (this.firstLoad) {
                window.localStorage.setItem(this.config.localStorageKey, JSON.stringify(data));
                this.firstLoad = false;
                return;
            }
            if (data.version !== localVersion.version) {
                this.blocked = true;
                this.end();
                this.openDialog(data);
            }
        }
    }

    private end(): void {
        clearInterval(this.interval);
        this.interval = null;
    }

}
