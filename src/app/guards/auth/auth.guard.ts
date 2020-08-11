import { map, tap } from 'rxjs/operators';
import { UserService } from './../../services/user/user.service';
import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Gives access only authenticates users to the route.
 */

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(
		private readonly _user: UserService,
		private readonly _router: Router
	) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		return this._user.isLoggedIn$.pipe(
			tap(this.redirectOnGuardReject.bind(this))
		);
	}

	private redirectOnGuardReject(isLoggedIn: boolean): void {
		if (!isLoggedIn) this._router.navigateByUrl('/login');
	}
}
