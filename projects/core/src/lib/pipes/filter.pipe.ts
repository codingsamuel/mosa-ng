import { Pipe, PipeTransform } from '@angular/core';
import { some } from '../utils/commons.util';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {

    public transform<T>(array: T[], searchValue: T[keyof T] | T[keyof T][], searchKey?: keyof T): T[] {
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
