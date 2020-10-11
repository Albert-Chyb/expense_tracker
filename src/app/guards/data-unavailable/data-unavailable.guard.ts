import { Pages } from './../../common/routing/routesUrls';
import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

/**
 * Give access only to users that haven't created initial data in database yet.
 */

@Injectable({
	providedIn: 'root',
})
export class DataUnavailableGuard implements CanActivate {
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
				if (hasCreated) this._router.navigateByUrl(Pages.Home);
			}),
			map(hasCreated => !hasCreated)
		);
	}
}
