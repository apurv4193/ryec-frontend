import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CommonService } from './../services';

@Injectable()
export class CategoryGuardService implements CanActivate {

	constructor(private cS: CommonService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
		console.log(state, route, route.params);
		if (route.params.hasOwnProperty('slug')) {
			return true;
		}
		this.cS.navigateTo('home');
		return false;
	}
}
