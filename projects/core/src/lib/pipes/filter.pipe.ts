import { Pipe, PipeTransform } from '@angular/core';
import { some } from '../utils/commons.util';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public transform<T>(array: T[] | undefined, searchValue: any, searchKey?: keyof T): T[] {
        // Return if array is empty or null
        if (!array?.length) {
            return [];
        }

        const foundItems: T[] = array.filter((v: T): boolean => some(v, searchValue, searchKey));
        if (!foundItems.length) {
            return [];
        }

        // Return whole item
        return foundItems;
    }

}
