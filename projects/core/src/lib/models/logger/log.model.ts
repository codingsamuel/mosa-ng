import { ILoggerConfig } from './logger-config.model';

export interface ILog {
    id: number;
    title: string | undefined;
    message: string | undefined;
    config: ILoggerConfig;
    icon: string;
    state?: 'enter' | 'leave';
}
