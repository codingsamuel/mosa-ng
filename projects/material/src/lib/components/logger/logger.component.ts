import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ILog, ILoggerConfig } from '@mosa-ng/core';
import { Observable } from 'rxjs';
import { ILoggerState } from '../../models/states/logger-state.model';
import { LoggerFacade } from '../../services/facades/logger.facade';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'mosa-logger',
    templateUrl: './logger.component.html',
    styleUrls: [ './logger.component.scss' ],
    animations: [
        trigger('slide', [
            state('enter', style({ transform: 'translateX(0)' })),
            transition(':leave', [
                animate(200, style({ transform: 'translateX(120%)' })),
            ]),
            transition(':enter', [
                style({ transform: 'translateX(120%)' }),
                animate(200, style({ transform: 'translateX(0)' })),
            ]),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class LoggerComponent extends BaseComponent implements OnInit {

    @ViewChildren('loggerElement')
    public elements: QueryList<HTMLElement>;

    public loggerState$: Observable<ILoggerState>;

    /**
     * Default constructor
     * @param myLoggerFacade
     */
    constructor(
        private readonly myLoggerFacade: LoggerFacade,
    ) {
        super();
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.loggerState$ = this.myLoggerFacade.subState();
    }

    public onClickLog(log: ILog): void {
        if (log.config.closeOnClick) {
            this.slideOut(log.id);
        }
    }

    /**
     * Shows the snackbar
     * @param title
     * @param message
     * @param type
     * @param config
     */
    public slideIn(title: string, message: string, type: string, config: ILoggerConfig): number {
        const logs: ILog[] = [ ...this.myLoggerFacade.snapshot.logs ];
        const i = logs.length;
        let icon: string;

        switch (type) {
            case 'error':
                icon = 'error';
                break;
            case 'warning':
                icon = 'warning';
                break;
            case 'info':
                icon = 'info';
                break;
            case 'success':
                icon = 'done';
                break;
            case 'default':
                icon = 'notifications';
                break;
        }

        logs.push({ id: i, title, message, config, state: 'enter', icon });
        this.myLoggerFacade.updateLogs(logs);
        return i;
    }

    /**
     * Hides the log
     * @param id
     */
    public slideOut(id: number): void {
        let logs: ILog[] = [ ...this.myLoggerFacade.snapshot.logs ];
        if (logs.length > 0) {
            const item = logs.find((e: ILog): boolean => e.id === id);
            if (item) {
                item.state = 'leave';
                this.myLoggerFacade.updateLogs(logs);
                setTimeout((): void => {
                    logs = [ ...this.myLoggerFacade.snapshot.logs ];
                    const index = logs.findIndex((log: ILog): boolean => log.id === item.id);
                    logs.splice(index, 1);
                    this.myLoggerFacade.updateLogs(logs);
                }, 200);
            }
        }
    }

    public callAction(log: ILog): void {
        log.config.action.callback.call(this);
        this.slideOut(log.id);
    }

}
