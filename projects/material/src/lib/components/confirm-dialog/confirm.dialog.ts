import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ConfirmDialogAction, ConfirmDialogData, ConfirmDialogResult } from '../../models/confirm-dialog.model';
import { MatButton } from '@angular/material/button';
import { UpperCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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
        UpperCasePipe,
        TranslateModule,
    ],
})
export class ConfirmDialog implements OnInit {

    public dialogData: ConfirmDialogData;
    public result: typeof ConfirmDialogResult = ConfirmDialogResult;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly myConfirmDialogData: ConfirmDialogData,
        private readonly myMatDialogRef: MatDialogRef<ConfirmDialog>,
    ) {
        const cancel: ConfirmDialogAction = new ConfirmDialogAction('mosa.commons.buttons.cancel', true);
        const deny: ConfirmDialogAction = new ConfirmDialogAction('mosa.commons.buttons.deny');
        const confirm: ConfirmDialogAction = new ConfirmDialogAction('mosa.commons.buttons.confirm', true);
        const title: string = 'mosa.components.confirmDialog.title';
        const message: string = 'mosa.components.confirmDialog.message';

        this.dialogData = myConfirmDialogData || new ConfirmDialogData(title, message, cancel, confirm, deny);

        if (!this.dialogData.title) {
            this.dialogData.title = title;
        }

        if (!this.dialogData.message) {
            this.dialogData.message = message;
        }

        if (!this.dialogData.cancel) {
            this.dialogData.cancel = cancel;
        }

        if (!this.dialogData.confirm) {
            this.dialogData.confirm = confirm;
        }

        if (!this.dialogData.deny) {
            this.dialogData.deny = deny;
        }
    }

    public ngOnInit(): void {
        //
    }

    public confirm(result: ConfirmDialogResult): void {
        this.myMatDialogRef.close(result);
    }

}
