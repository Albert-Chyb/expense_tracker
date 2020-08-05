import { Router } from '@angular/router';
import { ITransaction } from './../../common/models/transaction';
import { Observable } from 'rxjs';
import { TransactionsGroupsService } from './../../services/transactions-groups/transactions-groups.service';
import { TransactionsService } from './../../services/transactions/transactions.service';
import { Component, OnInit } from '@angular/core';

import { ITransactionGroup } from './../../common/models/group';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	templateUrl: './manage-transaction.component.html',
	styleUrls: ['./manage-transaction.component.scss'],
})
export class ManageTransactionComponent implements OnInit {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _groups: TransactionsGroupsService,
		private readonly _router: Router
	) {}

	form = new FormGroup({
		group: new FormControl(),
		amount: new FormControl(),
		date: new FormControl(new Date()),
		description: new FormControl(),
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
