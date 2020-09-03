import { ThemesService } from './../../services/themes/themes.service';
import { Pages } from 'src/app/common/routing/routesUrls';
import {
	Component,
	OnDestroy,
	OnInit,
	ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { whiteListValidator } from 'src/app/common/validators/whiteListValidator';
import { UserService } from 'src/app/services/user/user.service';

import { IUser } from './../../common/models/user';
import { SupportedThemeName } from 'src/app/common/models/themes';

@Component({
	templateUrl: './app-settings.component.html',
	styleUrls: ['./app-settings.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSettingsComponent implements OnInit, OnDestroy {
	constructor(
		private readonly _user: UserService,
		private readonly _themes: ThemesService
	) {}

	form = new FormGroup({
		autoEndAfter: new FormControl(30, [
			Validators.required,
			whiteListValidator(7, 30),
		]),
		autoEndPeriod: new FormControl(false, [Validators.required]),
	});
	theme = new FormControl(this._themes.currentThemeName);
	user$: Observable<IUser>;
	readonly Pages = Pages;
	private readonly subscriptions = new Subscription();

	updateSettings() {
		this._user.updateSettings(this.form.value);
	}

	changeTheme(name: SupportedThemeName) {
		this._themes.switchToByName(name);
	}

	ngOnInit() {
		this.user$ = this._user.user$.pipe(
			tap(user => this.form.patchValue(user.settings))
		);

		this.subscriptions.add(
			this.form.valueChanges.subscribe(this.updateSettings.bind(this))
		);

		this.subscriptions.add(
			this.theme.valueChanges.subscribe(this.changeTheme.bind(this))
		);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
