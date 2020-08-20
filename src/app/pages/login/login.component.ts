import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from './../../services/auth/auth.service';
import { UserService } from './../../services/user/user.service';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
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
						const route = hasCreatedData ? '/' : '/setup-account';
						this._router.navigateByUrl(route);
					})
			);
		} catch (error) {
			console.log(error);
		}
	}
}
