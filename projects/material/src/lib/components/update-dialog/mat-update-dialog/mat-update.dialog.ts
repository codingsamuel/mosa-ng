import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { IUpdateConfig, UpdateDialogResult } from '../../../models/update-config.model';
import { MatButton } from '@angular/material/button';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MosaDurationPipe } from '@mosa-ng/core';

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
        TranslatePipe,
        MosaDurationPipe,
    ],
})
export class MatUpdateDialog implements OnInit {

    private readonly myMatDialogRef: MatDialogRef<MatUpdateDialog> = inject(MatDialogRef<MatUpdateDialog>);

    constructor(
        @Inject(MAT_DIALOG_DATA) public readonly config: IUpdateConfig,
    ) {
    }

    public ngOnInit(): void {
        //
    }

    public close(result: UpdateDialogResult): void {
        this.myMatDialogRef.close(result);
    }

}
