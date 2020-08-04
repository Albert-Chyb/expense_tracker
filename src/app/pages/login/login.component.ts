import { UserService } from './../../services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	constructor(
		private readonly _auth: AuthService,
		private readonly _router: Router,
		private readonly _user: UserService
	) {}

	ngOnInit() {}

	async loginWithGoogle() {
		try {
			const credentials = await this._auth.loginWithGoogle();

			if (await this._user.isSetUpFully) this._router.navigateByUrl('/');
			else this._router.navigateByUrl('/setup-account');
		} catch (error) {
			console.log(error);
		}
	}
}
