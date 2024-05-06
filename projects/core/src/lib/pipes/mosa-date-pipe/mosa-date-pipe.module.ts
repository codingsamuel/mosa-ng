import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MosaDatePipe } from './mosa-date.pipe';

@NgModule({
    declarations: [ MosaDatePipe ],
    imports: [
        CommonModule,
    ],
    exports: [ MosaDatePipe ],
    providers: [ DatePipe ],
})
export class MosaDatePipeModule {
}
