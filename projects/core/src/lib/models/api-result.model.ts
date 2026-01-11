export interface IApiResult<T = unknown> {
    data: T;
    errorCode?: number;
    message?: string;
}
