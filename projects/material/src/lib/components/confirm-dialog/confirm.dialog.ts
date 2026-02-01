import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ConfirmDialogAction, ConfirmDialogData, ConfirmDialogResult } from '../../models/confirm-dialog.model';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'mosa-confirm-dialog',
    templateUrl: './confirm.dialog.html',
    styleUrls: [ './confirm.dialog.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        TranslateModule,
        MatIcon,
    ],
})
export class ConfirmDialog implements OnInit {

    public dialogData: ConfirmDialogData;
    public result: typeof ConfirmDialogResult = ConfirmDialogResult;

    private readonly myConfirmDialogData: ConfirmDialogData = inject(MAT_DIALOG_DATA);
    private readonly myMatDialogRef: MatDialogRef<ConfirmDialog> = inject(MatDialogRef);

    constructor() {
        const cancel: ConfirmDialogAction = new ConfirmDialogAction('mosa.commons.buttons.cancel', 'close', true);
        const deny: ConfirmDialogAction = new ConfirmDialogAction('mosa.commons.buttons.deny', 'block');
        const confirm: ConfirmDialogAction = new ConfirmDialogAction('mosa.commons.buttons.confirm', 'check', true);
        const title: string = 'mosa.components.confirmDialog.title';
        const message: string = 'mosa.components.confirmDialog.message';
        const defaultDialogData: ConfirmDialogData = new ConfirmDialogData(title, message, cancel, confirm, deny);

        this.dialogData = this.myConfirmDialogData || defaultDialogData;
        this.dialogData.title ??= defaultDialogData.title;
        this.dialogData.message ??= defaultDialogData.message;
        this.dialogData.cancel ??= cancel;
        this.dialogData.cancel ??= confirm;
        this.dialogData.deny ??= deny;
    }

    public ngOnInit(): void {
        //
    }

    public confirm(result: ConfirmDialogResult): void {
        this.myMatDialogRef.close(result);
    }

}
