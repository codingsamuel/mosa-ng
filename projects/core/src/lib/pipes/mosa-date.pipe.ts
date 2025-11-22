import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({ name: 'mosaDate' })
export class MosaDatePipe implements PipeTransform {

    private readonly store$: BehaviorSubject<number> = new BehaviorSubject<number>(new Date().getTime());

    private templates: Record<string, string> = {};

    private readonly myTranslateService: TranslateService = inject(TranslateService);
    private readonly myDatePipe: DatePipe = inject(DatePipe);

    constructor() {
        this.updateTemplates();
        setInterval((): void => this.store$.next(new Date().getTime()), 10);
        this.myTranslateService.onLangChange.subscribe((): void => {
            this.updateTemplates();
            this.store$.next(new Date().getTime());
        });
    }

    public transform(date: string | Date | undefined, mode: 'full' | 'timeSince' | 'date' = 'timeSince', options?: { withPrefix?: boolean, withSuffix?: boolean }): Observable<string> {
        return this.store$.pipe(map((currentDate: number): string => this.calcDate(currentDate, date, mode, options)));
    }

    private calcDate(currentTimestamp: number, date: string | Date | undefined, mode: 'full' | 'timeSince' | 'date', options?: { withPrefix?: boolean, withSuffix?: boolean }): string {
        if (!date) {
            return '';
        }

        let parsed: Date;
        if (date instanceof Date) {
            parsed = new Date(date.toString());
        } else {
            parsed = new Date(date);
        }

        if (!currentTimestamp) {
            currentTimestamp = new Date().getTime();
        }
        const currentDate = new Date(currentTimestamp);
        const parsedTimestamp: number = parsed.getTime();

        const convertedDate: string | null = this.myDatePipe.transform(parsed, 'dd. MMM. yyyy hh:mm aaa');
        if (mode === 'full' || mode === 'timeSince') {
            const seconds: number = Math.abs(((currentTimestamp - parsedTimestamp) * .001) >> 0);
            const minutes: number = seconds / 60;
            const hours: number = minutes / 60;
            const days: number = hours / 24;
            const years: number = days / 365;

            const yearDifference = (currentDate.getFullYear() - parsed.getFullYear()) * 12;
            const monthDifference = currentDate.getMonth() - parsed.getMonth();

            let timeSince: string = '';
            if (parsedTimestamp > currentTimestamp) {
                timeSince = (options?.withPrefix ? this.templates[ 'prefixFuture' ] : '') + (
                    seconds > 0 && seconds < 2 && this.template('second', 1) ||
                    seconds < 60 && this.template('seconds', seconds) ||
                    seconds < 120 && this.template('minute', 1) ||
                    minutes < 60 && this.template('minutes', minutes) ||
                    minutes < 120 && this.template('hour', 1) ||
                    hours < 24 && this.template('hours', hours) ||
                    hours < 42 && this.template('day', 1) ||
                    days < 30 && this.template('days', days) ||
                    days < 45 && this.template('month', 1) ||
                    days < 365 && this.template('months', yearDifference + monthDifference) ||
                    years < 1.5 && this.template('year', 1) ||
                    this.template('years', years)
                ) + (options?.withSuffix ? this.templates[ 'suffixFuture' ] : '');
            } else {
                timeSince = (options?.withPrefix ? this.templates[ 'prefixPast' ] : '') + (
                    seconds > 0 && seconds < 2 && this.template('second', 1) ||
                    seconds < 60 && this.template('seconds', seconds) ||
                    seconds < 120 && this.template('minute', 1) ||
                    minutes < 60 && this.template('minutes', minutes) ||
                    minutes < 120 && this.template('hour', 1) ||
                    hours < 24 && this.template('hours', hours) ||
                    hours < 42 && this.template('day', 1) ||
                    days < 30 && this.template('days', days) ||
                    days < 45 && this.template('month', 1) ||
                    days < 365 && this.template('months', yearDifference + monthDifference) ||
                    years < 1.5 && this.template('year', 1) ||
                    this.template('years', years)
                ) + (options?.withSuffix ? this.templates[ 'suffixPast' ] : '');
            }

            if (mode === 'timeSince') {
                return timeSince;
            }

            if (mode === 'full') {
                return `${convertedDate} (${timeSince})`;
            }
        }

        return convertedDate || '';
    }

    private template(key: string, val: number): string {
        return this.templates[ key ]?.replace(/%d/i, String(Math.abs(Math.round(val))));
    }

    private updateTemplates(): void {
        this.templates = {
            prefixPast: this.myTranslateService.instant('mosa.pipes.timeSince.prefix.past'),
            suffixPast: this.myTranslateService.instant('mosa.pipes.timeSince.suffix.past'),
            prefixFuture: this.myTranslateService.instant('mosa.pipes.timeSince.prefix.future'),
            suffixFuture: this.myTranslateService.instant('mosa.pipes.timeSince.suffix.future'),
            second: this.myTranslateService.instant('mosa.pipes.timeSince.second'),
            seconds: this.myTranslateService.instant('mosa.pipes.timeSince.seconds'),
            minute: this.myTranslateService.instant('mosa.pipes.timeSince.minute'),
            minutes: this.myTranslateService.instant('mosa.pipes.timeSince.minutes'),
            hour: this.myTranslateService.instant('mosa.pipes.timeSince.hour'),
            hours: this.myTranslateService.instant('mosa.pipes.timeSince.hours'),
            day: this.myTranslateService.instant('mosa.pipes.timeSince.day'),
            days: this.myTranslateService.instant('mosa.pipes.timeSince.days'),
            month: this.myTranslateService.instant('mosa.pipes.timeSince.month'),
            months: this.myTranslateService.instant('mosa.pipes.timeSince.months'),
            year: this.myTranslateService.instant('mosa.pipes.timeSince.year'),
            years: this.myTranslateService.instant('mosa.pipes.timeSince.years'),
        };
    }

}
