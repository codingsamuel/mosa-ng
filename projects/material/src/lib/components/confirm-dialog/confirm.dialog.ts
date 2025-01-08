import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogAction, ConfirmDialogData, ConfirmDialogResult } from '../../models/confirm-dialog.model';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'mosa-confirm-dialog',
    templateUrl: './confirm.dialog.html',
    styleUrls: [ './confirm.dialog.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ConfirmDialog extends BaseComponent implements OnInit {

    public dialogData: ConfirmDialogData;
    public result: typeof ConfirmDialogResult = ConfirmDialogResult;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly myConfirmDialogData: ConfirmDialogData,
        private readonly myMatDialogRef: MatDialogRef<ConfirmDialog>,
    ) {
        super();
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

    public override ngOnInit(): void {
        super.ngOnInit();
    }

    public confirm(result: ConfirmDialogResult): void {
        this.myMatDialogRef.close(result);
    }

}
