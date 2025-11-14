import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NgTemplateOutlet } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
    selector: 'mosa-loading-button',
    templateUrl: './loading-button.component.html',
    styleUrls: [ './loading-button.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButton,
        NgTemplateOutlet,
        MatIconButton,
        MatProgressSpinner,
        MatIcon,
        MatProgressBar,
    ],
})
export class LoadingButtonComponent {

    @Input()
    public mode: 'spinner' | 'progress-bar' = 'spinner';

    @Input()
    public loading: boolean;

    @Input()
    public disabled: boolean;

    @Input()
    public color: ThemePalette = 'primary';

    @Input()
    public buttonType: 'default' | 'raised' | 'stroked' | 'flat' | 'icon';

    @Input()
    public icon: string;

    @Output()
    public click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

    constructor() {
    }

    public onClick(e: MouseEvent): void {
        e.stopPropagation();
        this.click.emit(e);
    }

}
