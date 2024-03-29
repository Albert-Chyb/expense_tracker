import { tap } from 'rxjs/operators';
import {
	isDateWithinRange,
	DateRange,
} from './../../common/validators/isDateWithinRange';
import { isValidDate } from './../../common/validators/isValidDate';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { blackListValidator } from 'src/app/common/validators/blackListValidator';
import { isNotANumberValidator } from 'src/app/common/validators/isNotANumberValidator';

import { ITransactionGroup } from './../../common/models/group';
import { IOpenedPeriod } from './../../common/models/period';
import { Pages } from './../../common/routing/routesUrls';
import { PeriodsService } from './../../services/periods/periods.service';
import { TransactionsGroupsService } from './../../services/transactions-groups/transactions-groups.service';
import { TransactionsService } from './../../services/transactions/transactions.service';

@Component({
	templateUrl: './add-transaction.component.html',
	styleUrls: ['./add-transaction.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTransactionComponent implements OnInit {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _groups: TransactionsGroupsService,
		private readonly _router: Router,
		private readonly _periods: PeriodsService
	) {}

	private _rangeDates = new DateRange();

	form = new FormGroup({
		group: new FormControl('', Validators.required),
		amount: new FormControl(null, [
			Validators.required,
			blackListValidator(0),
			isNotANumberValidator,
		]),
		date: new FormControl(new Date(), [
			Validators.required,
			isValidDate,
			isDateWithinRange(this._rangeDates),
		]),
		description: new FormControl('', [
			Validators.required,
			Validators.maxLength(255),
		]),
	});
	groups$: Observable<ITransactionGroup[]>;
	data$: Observable<{
		groups: ITransactionGroup[];
		period: IOpenedPeriod;
	}>;
	Pages = Pages;

	ngOnInit() {
		const groups$ = this._groups.getAll();
		const period$ = this._periods.getCurrent();
		this.data$ = combineLatest([groups$, period$]).pipe(
			map(([groups, period]) => ({ groups, period })),
			tap(({ period }) => (this._rangeDates.min = period.date.start.toDate()))
		);
	}

	async addTransaction() {
		await this._transactions.add(this.form.value);
		this._router.navigateByUrl(Pages.Home);
	}
}
