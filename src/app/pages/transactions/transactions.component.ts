import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewChild,
} from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, mergeMap, scan, tap } from 'rxjs/operators';
import { ITransactionGroup } from 'src/app/common/models/group';
import { ITransaction } from 'src/app/common/models/transaction';
import {
	limit,
	orderBy,
	startAfter,
	where,
} from 'src/app/services/collection-base/dynamic-queries/helpers';
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

	@ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

	filters = new FormGroup({
		earliestDate: new FormControl(),
		latestDate: new FormControl(),
		lowestAmount: new FormControl(),
		highestAmount: new FormControl(),
		group: new FormControl(),
		description: new FormControl(),
		type: new FormControl(TransactionsType.All),
	});

	private readonly _transactionsPerCall = 20;
	private _isDownloadingNewTransactions = false;
	private _theEnd = false;
	private _lastSeenDoc: QueryDocumentSnapshot<ITransaction>;

	offsetChange$ = new BehaviorSubject<void>(null);
	transactions$: Observable<ITransaction[]>;
	groups$ = this._groups.getAll();
	data$: Observable<{
		transactions: ITransaction[];
		groups: ITransactionGroup[];
	}>;

	ngOnInit() {
		const offsetChange = this.offsetChange$.pipe(
			mergeMap(() => this.getNextTransactions()),
			scan((acc, curr) => ({ ...acc, ...curr }), {})
		);

		this.transactions$ = offsetChange.pipe(map(t => Object.values(t)));
		this.data$ = combineLatest([this.transactions$, this.groups$]).pipe(
			map(([transactions, groups]) => ({ transactions, groups }))
		);
	}

	getNextTransactions(): Observable<{ [id: string]: ITransaction }> {
		this._isDownloadingNewTransactions = true;

		console.log(this.hasFilters, this.filters.value);

		return this._transactions
			.querySnapshots(
				limit(this._transactionsPerCall),
				orderBy('date', 'desc'),
				this._lastSeenDoc ? startAfter(this._lastSeenDoc) : []
			)
			.pipe(
				tap(({ docs }) => (this._lastSeenDoc = docs[docs.length - 1])),
				map(({ docs }) =>
					docs.map(doc => ({
						id: doc.id,
						...doc.data(),
					}))
				),
				tap(r => (r.length ? null : (this._theEnd = true))),
				map(docs =>
					docs.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {})
				),
				tap(() => (this._isDownloadingNewTransactions = false))
			);
	}

	onScroll($event: number) {
		if (this._theEnd) return;

		const total = this.virtualScroll.getDataLength();
		const { end } = this.virtualScroll.getRenderedRange();

		if (total === end && !this._isDownloadingNewTransactions) {
			this.offsetChange$.next();
		}
	}

	trackBy(index: number, { id }: ITransaction) {
		return id;
	}

	applyFilters() {
		// Reset last seen document.
		this._lastSeenDoc = null;
		// Reset the end property.

		this._theEnd = false;
		// Call getNextTransactions method

		this.offsetChange$.next();
	}

	removeFilters() {
		// Reset last seen document.
		this._lastSeenDoc = null;
		// Reset the end property.

		this._theEnd = false;
		// Call getNextTransactions method

		this.offsetChange$.next();
	}

	get hasFilters() {
		return Object.values(this.filters.value).some(filter => !!filter);
	}

	get isDownloadingNewTransactions() {
		return this._isDownloadingNewTransactions;
	}
}
