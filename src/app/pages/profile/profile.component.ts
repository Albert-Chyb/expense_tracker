import { ConfirmDialogData } from './../../components/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
	confirmLogOutDialogData: ConfirmDialogData = {
		title: 'Potwierdź chęć wylogowania się',
		description:
			'Czy napewno chcesz się wylogować ? Aby ponownie skorzystać z aplkiacji będzie wymagane ponowne logowanie.',
	};
	confirmEndPeriodData: ConfirmDialogData = {
		title: 'Potwierdź zamknięcie okresu',
		description: `Czy napewno chcesz zamknąć ten okres rozliczeniowy ? Będziesz mógł go ponownie otworyć do północy.`,
	};
	confirmOpenPeriodData: ConfirmDialogData = {
		title: 'Potwierdź otwarcie okresu',
		description: `Czy napewno chcesz ponownie otworzyć obency okres ?`,
	};

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
		this._router.navigateByUrl(Pages.Login);
	}
}
