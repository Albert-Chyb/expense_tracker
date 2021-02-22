import { NotificationsService } from './../../services/notifications/notifications.service';
import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ErrorsMessages } from './../../common/errors/errorsMessages';
import { Pages } from './../../common/routing/routesUrls';
import { AuthService } from './../../services/auth/auth.service';
import { ErrorsService } from './../../services/errors/errors.service';
import { UserService } from './../../services/user/user.service';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy, OnInit {
	constructor(
		private readonly _auth: AuthService,
		private readonly _router: Router,
		private readonly _user: UserService,
		private readonly _errors: ErrorsService,
		private readonly _notifications: NotificationsService
	) {}

	private readonly subscriptions = new Subscription();

	ngOnInit() {
		this.subscriptions.add(
			this._auth.onLogin$
				.pipe(switchMap(user => this._user.hasCreatedData$))
				.subscribe(hasCreatedData => {
					const { Home, SetupAccount } = Pages;
					const routeUrl = hasCreatedData ? Home : SetupAccount;
					this._router.navigateByUrl(routeUrl);
				})
		);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	async loginWithGoogle() {
		try {
			await this._auth.loginWithGoogle();
			this._notifications.success(
				'Poprawnie zalogowano za pomocą konta Google',
				'Witaj w naszej aplikacji !'
			);
		} catch (error) {
			this.handleError(error);
		}
	}
	private handleError(error: firebase.FirebaseError) {
		switch (error.code) {
			case 'auth/popup-closed-by-user':
				this._errors.notifyUser(ErrorsMessages.PopupClosedByUser);
				break;

			case 'auth/popup-blocked':
				this._errors.notifyUser(ErrorsMessages.PopupBlocked);
				break;

			case 'auth/cancelled-popup-request':
				this._errors.notifyUser(ErrorsMessages.CancelledPopupRequest);
				break;

			default:
				throw error;
		}
	}
}
