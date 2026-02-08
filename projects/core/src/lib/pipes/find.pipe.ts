import { Pipe, PipeTransform } from '@angular/core';
import { some } from '../utils/commons.util';

@Pipe({ name: 'find' })
export class FindPipe implements PipeTransform {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public transform<T>(array: T[] | undefined, searchValue: any, searchKey?: keyof T, compareFn: ((item: T, val: T[keyof T]) => boolean) | 'equals' | 'not-equals' = 'equals'): T | null {
        // Return if array is empty or null
        if (!array?.length) {
            return null;
        }

        const foundItem: T | undefined = array.find((v: T): boolean => some(v, searchValue, searchKey, compareFn));
        if (!foundItem) {
            return null;
        }

        // Return whole item
        return foundItem;
    }

}
