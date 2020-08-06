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
 * Prevents authenticated users from accessing the route.
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
			map(status => !status),
			tap(canActivate => {
				if (!canActivate) this._router.navigateByUrl('/');
			})
		);
	}
}