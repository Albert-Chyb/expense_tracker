import { Pages } from './../../common/routing/routesUrls';
import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from './../../services/auth/auth.service';
import { UserService } from './../../services/user/user.service';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
	constructor(
		private readonly _auth: AuthService,
		private readonly _router: Router,
		private readonly _user: UserService
	) {}

	subscriptions = new Subscription();

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	async loginWithGoogle() {
		try {
			await this._auth.loginWithGoogle();

			this.subscriptions.add(
				this._auth.onLogin$
					.pipe(switchMap(user => this._user.hasCreatedData$))
					.subscribe(hasCreatedData => {
						const { Home, SetupAccount } = Pages;
						const routeUrl = hasCreatedData ? Home : SetupAccount;
						this._router.navigateByUrl(routeUrl);
					})
			);
		} catch (error) {
			console.log(error);
		}
	}
}
