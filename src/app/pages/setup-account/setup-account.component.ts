import { IUser } from './../../common/models/user';
import { ICompletingData } from './../../common/models/completingData';
import { Router } from '@angular/router';
import { UserService } from './../../services/user/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './setup-account.component.html',
	styleUrls: ['./setup-account.component.scss'],
})
export class SetupAccountComponent implements OnInit {
	constructor(
		private readonly _user: UserService,
		private readonly _router: Router
	) {}

	form = new FormGroup({
		balance: new FormControl(),
		settings: new FormGroup({
			autoEndAfter: new FormControl('30'),
			autoEndPeriod: new FormControl(false),
		}),
	});

	ngOnInit() {}

	async completeCreatingAccount() {
		const data: ICompletingData = this.form.value;

		await this._user.completeCreatingAccount(data);
		this._router.navigateByUrl('/');
	}
}
