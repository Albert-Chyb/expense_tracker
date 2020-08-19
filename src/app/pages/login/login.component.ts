import { tap } from 'rxjs/operators';
import { UserService } from './../../services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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
			const hasCreatedData = await this._user.hasCreatedData;

			if (hasCreatedData) this._router.navigateByUrl('/');
			else this._router.navigateByUrl('/setup-account');
		} catch (error) {
			console.log(error);
		}
	}
}
