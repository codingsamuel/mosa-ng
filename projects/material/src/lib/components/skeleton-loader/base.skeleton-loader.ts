import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'mosa-skeleton-loader',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class BaseSkeletonLoader {

    @Input()
    public itemCount: number;

}
