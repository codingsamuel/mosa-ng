import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BaseSkeletonLoader } from '../base.skeleton-loader';

@Component({
    selector: 'mosa-list-skeleton-loader',
    templateUrl: './list.skeleton-loader.html',
    styleUrls: [ './list.skeleton-loader.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ListSkeletonLoader extends BaseSkeletonLoader implements OnInit {

    @Input()
    public content: TemplateRef<unknown>;

    public items: number[] = [];

    constructor() {
        super();
    }

    public ngOnInit(): void {
        this.items = Array(this.itemCount).fill(this.itemCount).map((x: number, i: number): number => i);
    }

}
