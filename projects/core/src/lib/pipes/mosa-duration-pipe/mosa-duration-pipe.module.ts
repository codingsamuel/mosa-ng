import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MosaDurationPipe } from './mosa-duration.pipe';

@NgModule({
    declarations: [ MosaDurationPipe ],
    imports: [
        CommonModule,
    ],
    exports: [ MosaDurationPipe ],
})
export class MosaDurationPipeModule {
}
