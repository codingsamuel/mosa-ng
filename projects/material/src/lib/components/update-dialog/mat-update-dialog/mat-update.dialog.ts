import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { IUpdateConfig, UpdateDialogResult } from '../../../models/update-config.model';
import { BaseComponent } from '../../base/base.component';
import { MatButton } from '@angular/material/button';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { MosaDurationPipeModule } from '@mosa-ng/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'mosa-mat-update-dialog',
    templateUrl: './mat-update.dialog.html',
    styleUrls: [ './mat-update.dialog.scss' ],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        AsyncPipe,
        UpperCasePipe,
        MosaDurationPipeModule,
        TranslateModule,
    ],
})
export class MatUpdateDialog extends BaseComponent implements OnInit {

    constructor(
        private readonly myMatDialogRef: MatDialogRef<MatUpdateDialog>,
        @Inject(MAT_DIALOG_DATA) public readonly config: IUpdateConfig,
    ) {
        super();
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }

    public close(result: UpdateDialogResult): void {
        this.myMatDialogRef.close(result);
    }

}
