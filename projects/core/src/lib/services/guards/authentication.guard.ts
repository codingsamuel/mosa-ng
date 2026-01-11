import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../api.service';

export const authenticationGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    const apiService: ApiService = inject(ApiService);
    if (!apiService.getToken()) {
        return false;
    }

    return true;
};
