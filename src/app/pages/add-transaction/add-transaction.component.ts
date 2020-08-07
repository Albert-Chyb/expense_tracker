import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { blackListValidator } from 'src/app/common/validators/blackListValidator';

import { ITransactionGroup } from './../../common/models/group';
import { TransactionsGroupsService } from './../../services/transactions-groups/transactions-groups.service';
import { TransactionsService } from './../../services/transactions/transactions.service';
import { isNotANumber } from 'src/app/common/validators/isNotANumberValidator';

@Component({
	templateUrl: './add-transaction.component.html',
	styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _groups: TransactionsGroupsService,
		private readonly _router: Router
	) {}

	form = new FormGroup({
		group: new FormControl('', Validators.required),
		amount: new FormControl(null, [
			Validators.required,
			blackListValidator(0),
			isNotANumber,
		]),
		date: new FormControl(new Date(), Validators.required),
		description: new FormControl('', [
			Validators.required,
			Validators.maxLength(255),
		]),
	});

	groups$: Observable<ITransactionGroup[]>;

	ngOnInit() {
		this.groups$ = this._groups.getAll();
	}

	async addTransaction() {
		await this._transactions.add(this.form.value);
		this._router.navigateByUrl('/');
	}
}
