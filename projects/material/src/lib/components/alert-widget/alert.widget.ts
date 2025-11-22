import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'mosa-alert-widget',
    templateUrl: './alert.widget.html',
    styleUrls: [ './alert.widget.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ MatIcon ],
})
export class AlertWidget implements OnInit, OnChanges {

    @Input()
    public icon: string | undefined;

    @Input()
    public title: string | undefined;

    @Input()
    public message: string | undefined;

    @Input()
    public type: 'warning' | 'error' | 'info' | 'success' | undefined;

    constructor() {
    }

    public ngOnInit(): void {
        this.updateData();
    }

    public ngOnChanges(_changes: SimpleChanges): void {
        this.updateData();
    }

    private updateData(): void {
        if (!this.title || !this.icon) {
            switch (this.type) {
                case 'error':
                    this.icon ||= 'alert-circle-outline';
                    this.title ||= 'Error';
                    break;
                case 'info':
                    this.icon ||= 'information-outline';
                    this.title ||= 'Information';
                    break;
                case 'success':
                    this.icon ||= 'check';
                    this.title ||= 'Success';
                    break;
                case 'warning':
                    this.icon ||= 'alert-outline';
                    this.title ||= 'Warning';
                    break;
                default:
                    this.icon ||= 'information-outline';
                    this.title ||= 'Alert';
                    break;
            }
        }
    }

}
