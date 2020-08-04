import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { tap } from 'rxjs/operators';
import { IUser } from './../../common/models/user';
import { Observable } from 'rxjs';
import { UserService } from './../../services/user/user.service';
import { Component, OnInit } from '@angular/core';

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
