import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DashboardConfigDataService } from '../../services/dashboard-config-data.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private _configService: DashboardConfigDataService ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if ((location.hostname == this._configService.$host && location.port == this._configService.$port) && this._configService.$userName && (this._configService.$userPass)) {
            if (('10.10.50.11' == this._configService.$host && '8002' == this._configService.$port) && this._configService.$userName && (this._configService.$userPass)) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}