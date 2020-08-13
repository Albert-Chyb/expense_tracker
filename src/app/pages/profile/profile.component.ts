import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { IUser } from './../../common/models/user';
import { AuthService } from './../../services/auth/auth.service';
import { UserService } from './../../services/user/user.service';

@Component({
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
	constructor(
		private readonly _user: UserService,
		private readonly _auth: AuthService,
		private readonly _router: Router
	) {}

	user$: Observable<IUser>;

	ngOnInit() {
		this.user$ = this._user.user$;
	}

	async logOut() {
		await this._auth.logout();
		this._router.navigateByUrl('/login');
	}
}
