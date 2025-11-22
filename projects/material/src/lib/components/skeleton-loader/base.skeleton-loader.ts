import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'mosa-skeleton-loader',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class BaseSkeletonLoader {

    @Input()
    public itemCount: number | undefined;

}
