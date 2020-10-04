import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ITransactionGroup } from 'src/app/common/models/group';
import { ITransaction } from 'src/app/common/models/transaction';
import { blackListValidator } from 'src/app/common/validators/blackListValidator';
import { isNotANumberValidator } from 'src/app/common/validators/isNotANumberValidator';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

import { IOpenedPeriod } from './../../common/models/period';
import { Pages } from './../../common/routing/routesUrls';
import { PeriodsService } from './../../services/periods/periods.service';

@Component({
	templateUrl: './manage-transaction.component.html',
	styleUrls: ['./manage-transaction.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageTransactionComponent implements OnInit {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _groups: TransactionsGroupsService,
		private readonly _router: Router,
		private readonly _route: ActivatedRoute,
		private readonly _periods: PeriodsService
	) {}

	form = new FormGroup({
		group: new FormControl('', Validators.required),
		amount: new FormControl(null, [
			Validators.required,
			blackListValidator(0),
			isNotANumberValidator,
		]),
		date: new FormControl(new Date(), Validators.required),
		description: new FormControl('', [
			Validators.required,
			Validators.maxLength(255),
		]),
	});
	data$: Observable<{
		groups: ITransactionGroup[];
		transaction: ITransaction;
		period: IOpenedPeriod;
	}>;
	Pages = Pages;
	private originalTransaction: ITransaction;

	ngOnInit() {
		const groups$ = this._groups.getAll();
		const transactions$ = this._transactions.get(this.transactionId).pipe(
			map(transaction => {
				if (transaction === undefined) return {} as any;
				this.originalTransaction = { ...transaction };
				transaction.group = transaction.group.id as any;
				transaction.date = transaction.date.toDate() as any;
				return transaction;
			})
		);
		const period$ = this._periods.getCurrent();

		this.data$ = combineLatest([groups$, transactions$, period$]).pipe(
			map(([groups, transaction, period]) => ({ groups, transaction, period })),
			tap(data => this.form.patchValue(data.transaction))
		);
	}

	async update() {
		// Contains transaction data from form.
		const newTransaction = this.form.value;

		// Indicates if user has changed transaction group.
		const isTheSameGroup =
			this.originalTransaction.group.id === newTransaction.group;

		// If user hasn't changed the group, then replace group property of new transaction with original transaction.
		if (isTheSameGroup) newTransaction.group = this.originalTransaction.group;

		// If user hasn't changed the group, then there is no need for populating transaction group.
		// This is important because a transaction can have a group that was previously deleted from database.
		await this._transactions.update(
			this.transactionId,
			this.form.value,
			!isTheSameGroup
		);

		// After a transaction has been updated, return to home page.
		this._router.navigateByUrl(Pages.Home);
	}

	async delete() {
		await this._transactions.delete(this.transactionId);
		this._router.navigateByUrl(Pages.Home);
	}

	private get transactionId(): string {
		return this._route.snapshot.params.id;
	}
}
