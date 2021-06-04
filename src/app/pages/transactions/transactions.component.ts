import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITransactionGroup } from 'src/app/common/models/group';
import { ITransaction } from 'src/app/common/models/transaction';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

enum TransactionsType {
	All = '',
	Expenses = 'expenses',
	Incomes = 'incomes',
}

interface FormValue {
	date: {
		earliest: Date;
		latest: Date;
	};

	amount: {
		lowest: number;
		highest: number;
	};

	group: string;
	description: string;
	type: string;
}

@Component({
	templateUrl: './transactions.component.html',
	styleUrls: ['./transactions.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnInit {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _groups: TransactionsGroupsService
	) {}

	filters = new FormGroup({
		date: new FormGroup({
			earliest: new FormControl(),
			latest: new FormControl(),
		}),
		amount: new FormGroup({
			lowest: new FormControl(),
			hightest: new FormControl(),
		}),
		group: new FormControl(),
		description: new FormControl(),
		type: new FormControl(TransactionsType.All),
	});

	transactions$ = this._transactions.getAll();
	groups$ = this._groups.getAll();

	data$: Observable<{
		transactions: ITransaction[];
		groups: ITransactionGroup[];
	}> = combineLatest([this.transactions$, this.groups$]).pipe(
		map(([transactions, groups]) => ({ transactions, groups }))
	);

	ngOnInit(): void {}

	applyFilters() {
		const filters: FormValue = this.filters.value;

		console.log(filters);
	}
}
