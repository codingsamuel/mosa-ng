import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'as' })
export class AsPipe implements PipeTransform {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public transform<T>(item: any, _type: T): T {
        return item as T;
    }

}
