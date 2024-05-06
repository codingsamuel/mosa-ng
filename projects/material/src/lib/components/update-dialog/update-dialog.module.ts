import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatUpdateDialog } from './mat-update-dialog/mat-update.dialog';
import { UpdateDialog } from './update.dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MosaDurationPipeModule } from '@mosa-ng/core';

@NgModule({
    declarations: [ UpdateDialog, MatUpdateDialog ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MosaDurationPipeModule,
        TranslateModule,
    ],
    exports: [ UpdateDialog ],
})
export class UpdateDialogModule {
}
