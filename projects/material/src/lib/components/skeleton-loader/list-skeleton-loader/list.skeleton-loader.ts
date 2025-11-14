import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BaseSkeletonLoader } from '../base.skeleton-loader';
import { MatList, MatListItem } from '@angular/material/list';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'mosa-list-skeleton-loader',
    templateUrl: './list.skeleton-loader.html',
    styleUrls: [ './list.skeleton-loader.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatList,
        MatListItem,
        NgTemplateOutlet,
    ],
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
