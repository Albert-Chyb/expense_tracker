import { Pages } from './../../common/routing/routesUrls';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ICompletingData } from './../../common/models/completingData';
import { UserService } from './../../services/user/user.service';

@Component({
	templateUrl: './setup-account.component.html',
	styleUrls: ['./setup-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupAccountComponent {
	constructor(
		private readonly _user: UserService,
		private readonly _router: Router
	) {}

	form = new FormGroup({
		balance: new FormControl(null, [Validators.required]),
		settings: new FormGroup({
			autoEndAfter: new FormControl(30),
			autoEndPeriod: new FormControl(false),
		}),
	});

	async completeCreatingAccount() {
		const data: ICompletingData = this.form.value;

		await this._user.createData(data);
		this._router.navigateByUrl(Pages.Home);
	}
}
