import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITransactionGroup } from 'src/app/common/models/group';
import { blackListValidator } from 'src/app/common/validators/blackListValidator';
import { isNotANumber } from 'src/app/common/validators/isNotANumberValidator';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

@Component({
	templateUrl: './manage-transaction.component.html',
	styleUrls: ['./manage-transaction.component.scss'],
})
export class ManageTransactionComponent implements OnInit, OnDestroy {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _groups: TransactionsGroupsService,
		private readonly _router: Router,
		private readonly _route: ActivatedRoute
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
	private _subscriptions = new Subscription();

	ngOnInit() {
		this.groups$ = this._groups.getAll();
		this._subscriptions.add(
			this._transactions
				.get(this._route.snapshot.params.id)
				.pipe(
					map(transaction => {
						const data = transaction;
						data.group = data.group.id as any;
						return data;
					})
				)
				.subscribe(transaction => this.form.patchValue(transaction))
		);
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	async update() {
		await this._transactions.update(this.transactionId, this.form.value);
		this._router.navigateByUrl('/');
	}

	private get transactionId(): string {
		return this._route.snapshot.params.id;
	}
}
