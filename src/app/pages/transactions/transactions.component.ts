import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { ITransactionGroup } from 'src/app/common/models/group';
import { ITransaction } from 'src/app/common/models/transaction';
import { where } from 'src/app/services/collection-base/dynamic-queries/helpers';
import { DynamicQuery } from 'src/app/services/collection-base/dynamic-queries/models';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

enum TransactionsType {
	All = '',
	Expenses = 'expenses',
	Incomes = 'incomes',
}

interface FormValue {
	earliestDate: Date;
	latestDate: Date;
	lowestAmount: number;
	highestAmount: number;
	group: string;
	type: TransactionsType;
}

const QUERIES = new Map<keyof FormValue, (value: any) => DynamicQuery>([
	['earliestDate', (date: Date) => where('date', '>=', date)],
	['latestDate', (date: Date) => where('date', '<=', date)],
	['lowestAmount', (amount: number) => where('amount', '>=', amount)],
	['highestAmount', (amount: number) => where('amount', '<=', amount)],
	['group', (group: string) => where('group.id', '==', group)],
	[
		'type',
		(type: TransactionsType) => {
			let query: DynamicQuery;

			switch (type) {
				case TransactionsType.Expenses:
					query = where('amount', '<', 0);
					break;

				case TransactionsType.Incomes:
					query = where('amount', '>', 0);
					break;
			}

			return query;
		},
	],
]);

// TODO: Add loading indicator
// TODO: Add infinite scroll

@Component({
	templateUrl: './transactions.component.html',
	styleUrls: ['./transactions.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _groups: TransactionsGroupsService
	) {}

	filters = new FormGroup({
		earliestDate: new FormControl(),
		latestDate: new FormControl(),
		lowestAmount: new FormControl(),
		highestAmount: new FormControl(),
		group: new FormControl(),
		description: new FormControl(),
		type: new FormControl(TransactionsType.All),
	});

	isLoading = true;

	isFiltered$ = new BehaviorSubject(false);
	groups$ = this._groups.getAll();
	transactions$ = this.isFiltered$
		.pipe(
			switchMap(isFiltered =>
				isFiltered ? this.filteredTransactions$() : this._transactions.getAll()
			),
			tap(() => (this.isLoading = false))
		)
		.pipe();
	data$: Observable<{
		transactions: ITransaction[];
		groups: ITransactionGroup[];
	}> = combineLatest([this.transactions$, this.groups$]).pipe(
		map(([transactions, groups]) => ({ transactions, groups }))
	);

	filteredTransactions$() {
		const filters: FormValue = this.filters.value;
		const queries = Object.entries(filters)
			.filter(([key, value]) => !!value && QUERIES.has(<any>key))
			.map(([key, value]) => QUERIES.get(<any>key)(value))
			.filter(query => query !== null);

		if (queries.length > 0) {
			return this._transactions.query(queries);
		}
	}

	applyFilters() {
		this.isFiltered$.next(true);
		this.isLoading = true;
	}

	removeFilters() {
		this.isFiltered$.next(false);
		this.isLoading = true;
	}

	get hasFilters() {
		return Object.values(this.filters.value).some(filter => !!filter);
	}

	get isFiltered() {
		return this.isFiltered$.value;
	}
}
