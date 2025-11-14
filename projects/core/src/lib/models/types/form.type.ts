import { AbstractControl } from '@angular/forms';

export type FormType<T> = {
    [K in keyof T]: AbstractControl<T[K] | null>
};
