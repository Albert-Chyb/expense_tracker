import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Confirmable } from 'src/app/services/dialog/dialog.service';

import { IOpenedPeriod } from './../../common/models/period';
import { IUser } from './../../common/models/user';
import { Pages } from './../../common/routing/routesUrls';
import { AuthService } from './../../services/auth/auth.service';
import { PeriodsService } from './../../services/periods/periods.service';
import { UserService } from './../../services/user/user.service';

@Component({
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	Pages = Pages;
	ngOnInit() {
		const user$ = this._user.user$;
		const period$ = this._periods.getCurrent();

		this.data$ = combineLatest([user$, period$]).pipe(
			map(([user, period]) => ({ user, period }))
		);
	}

	@Confirmable({
		title: 'Potwierdź zamknięcie okresu',
		description: `Czy napewno chcesz zamknąć ten okres rozliczeniowy ? Będziesz mógł go ponownie otworyć do północy.`,
	})
	endPeriod() {
		this._periods.endCurrent();
	}

	@Confirmable({
		title: 'Potwierdź otwarcie okresu',
		description: `Czy napewno chcesz ponownie otworzyć obency okres ?`,
	})
	openPeriod() {
		this._periods.openCurrent();
	}

	@Confirmable({
		title: 'Potwierdź chęć wylogowania się',
		description:
			'Czy napewno chcesz się wylogować ? Aby ponownie skorzystać z aplkiacji będzie wymagane ponowne logowanie.',
	})
	async logOut() {
		await this._auth.logout();
		this._router.navigateByUrl(Pages.Login);
	}
}
