import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, CanLoad, Route, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService, } from './../services';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {


	constructor(private authService: AuthService,
		private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

		console.log(route.url);
		if (this.authService.isLoggedIn()) {

			return true;
		}
		// do something if not logged in
		this.router.navigate(['signup'], { queryParams: { returnUrl: state.url } });
		return false;
	}

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
		return this.canActivate(childRoute, state);
	}

	canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
		console.log(route);
		if (this.authService.isLoggedIn()) {
			return true;
		}
		return false;
	}

}
