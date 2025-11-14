import { Pipe, PipeTransform } from '@angular/core';
import { some } from '../utils/commons.util';

@Pipe({ name: 'find' })
export class FindPipe implements PipeTransform {

    public transform<T>(array: T[], searchValue: T[keyof T] | T[keyof T][], searchKey?: keyof T): T {
        // Return if array is empty or null
        if (!array?.length) {
            return null;
        }

        const foundItem: T = array.find((v: T): boolean => some(v, searchValue, searchKey));
        if (!foundItem) {
            return null;
        }

        // Return whole item
        return foundItem;
    }

}
