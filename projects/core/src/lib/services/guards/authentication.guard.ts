import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../api.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
    const apiService: ApiService = inject(ApiService);
    if (!apiService.getToken()) {
        return false;
    }

    return true;
};
