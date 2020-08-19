import { map } from 'rxjs/operators';
import { IClosedPeriod, IOpenedPeriod } from './../../common/models/period';
import { PeriodsService } from './../../services/periods/periods.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';

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
		private readonly _router: Router,
		private readonly _periods: PeriodsService
	) {}

	data$: Observable<{
		user: IUser;
		period: IOpenedPeriod;
	}>;

	ngOnInit() {
		const user$ = this._user.user$;
		const period$ = this._periods.getCurrent();

		this.data$ = combineLatest([user$, period$]).pipe(
			map(([user, period]) => ({ user, period }))
		);
	}

	endPeriod() {
		this._periods.endCurrent();
	}

	openPeriod() {
		this._periods.openCurrent();
	}

	async logOut() {
		await this._auth.logout();
		this._router.navigateByUrl('/login');
	}
}
