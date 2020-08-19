import { tap } from 'rxjs/operators';
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
 * Give access to users that created initial data in database.
 */

@Injectable({
	providedIn: 'root',
})
export class DataAvailableGuard implements CanActivate {
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
		return this._user.hasCreatedData$.pipe(
			tap(hasCreated => {
				if (!hasCreated) this._router.navigateByUrl('/setup-account');
			})
		);
	}
}
