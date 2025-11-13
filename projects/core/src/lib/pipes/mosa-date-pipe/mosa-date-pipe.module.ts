import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MosaDatePipe } from './mosa-date.pipe';

@NgModule({
    imports: [
        CommonModule,
        MosaDatePipe,
    ],
    exports: [ MosaDatePipe ],
    providers: [ DatePipe ],
})
export class MosaDatePipeModule {
}
