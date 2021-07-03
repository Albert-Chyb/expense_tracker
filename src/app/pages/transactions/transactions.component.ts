import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewChild,
} from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import {
	distinctUntilChanged,
	filter,
	first,
	map,
	mapTo,
	mergeMap,
	pairwise,
	scan,
	switchMapTo,
	tap,
} from 'rxjs/operators';
import { ITransaction } from 'src/app/common/models/transaction';
import {
	limit,
	orderBy,
	startAfter,
	where,
} from 'src/app/services/collection-base/dynamic-queries/helpers';
import { DynamicQuery } from 'src/app/services/collection-base/dynamic-queries/models';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

import {
	FiltersIntention,
	IFilters,
	IFiltersAction,
	TransactionsFiltersDialogComponent,
	TransactionsType,
} from '../../components/transactions-filters-dialog/transactions-filters-dialog.component';

const SERVER_QUERIES = new Map<keyof IFilters, (value: any) => DynamicQuery>([
	['earliestDate', (date: Date) => where('date', '>=', date)],
	['latestDate', (date: Date) => where('date', '<=', date)],
	['group', (group: string) => where('group.id', '==', group)],
]);

const LOCAL_QUERIES = new Map<
	keyof IFilters,
	(v: any) => (t: ITransaction) => boolean
>([
	['lowestAmount', (amount: number) => (t: ITransaction) => t.amount >= amount],
	[
		'highestAmount',
		(amount: number) => (t: ITransaction) => t.amount <= amount,
	],
	[
		'type',
		(type: TransactionsType) => {
			switch (type) {
				case TransactionsType.Expenses:
					return ({ amount }: ITransaction) => amount < 0;

				case TransactionsType.Incomes:
					return ({ amount }: ITransaction) => amount > 0;

				default:
					return () => true;
			}
		},
	],
]);

const FILTERS_KEYS = [...SERVER_QUERIES.keys(), ...LOCAL_QUERIES.keys()];

@Component({
	templateUrl: './transactions.component.html',
	styleUrls: ['./transactions.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnInit {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _dialog: DialogService,
		private readonly _route: ActivatedRoute,
		private readonly _router: Router
	) {}

	/** (Angular Material CDK) Virtual scroll container reference. */
	@ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

	/** How many documents should be included in a single batch. */
	private readonly _batchSize = 20;
	/** Indicates if new batch is being downloaded. */
	private _isDownloading = false;
	/** Indicates if the end of the collection has been reached. */
	private _theEnd = false;
	/** Last document in the last batch. */
	private _lastSeen: QueryDocumentSnapshot<ITransaction>;
	/** Gets next transactions */
	private readonly _offset$ = new BehaviorSubject<void>(null);
	/** Contains all transactions stored so far */
	transactions$: Observable<ITransaction[]>;

	ngOnInit() {
		const filters$: Observable<IFilters> = this._route.queryParams as any;
		const offset$ = this._offset$.pipe(
			tap(() => (this._isDownloading = true)),
			switchMapTo(filters$),
			mergeMap((filters: IFilters) => this.getNextTransactions(filters)),
			map(current => previous => ({ ...previous, ...current }))
		);
		const reset$ = filters$.pipe(
			distinctUntilChanged((prev, curr) =>
				FILTERS_KEYS.map(
					watchedKey => prev[watchedKey] === curr[watchedKey]
				).every(isTheSame => isTheSame)
			),
			tap(() => {
				this._theEnd = false;
				this._lastSeen = null;
				this._offset$.next();
			}),
			mapTo(() => ({}))
		);

		this.transactions$ = merge(offset$, reset$).pipe(
			scan((acc, action) => action(acc), {}),
			map(t => Object.values(t))
		);
	}

	/**
	 * Returns next batch of transactions, relative to the last seen document.
	 * If any filters are set, it will apply them.
	 *
	 * @returns Object with transaction id as key and transaction object as a value.
	 */
	getNextTransactions(
		filters: IFilters
	): Observable<{ [id: string]: ITransaction }> {
		return this._transactions
			.querySnapshots(
				limit(this._batchSize),
				orderBy('date', 'desc'),
				this._lastSeen ? startAfter(this._lastSeen) : [],
				filters ? this._buildQueries(filters, SERVER_QUERIES) : []
			)
			.pipe(
				// Save last received document for startAfter query.
				tap(({ docs }) => (this._lastSeen = docs[docs.length - 1])),
				// Convert snapshots into document data
				map(({ docs }) => {
					const queries = this._buildQueries(filters, LOCAL_QUERIES);
					let transactions = docs.map(doc => ({
						id: doc.id,
						...doc.data(),
					}));

					if (queries.length) {
						transactions = transactions.filter(transaction =>
							queries.map(query => query(transaction)).every(isValid => isValid)
						);
					}

					return transactions;
				}),
				// Receiving no items, means no further calls should be made.
				tap(r => (r.length > 0 ? null : (this._theEnd = true))),
				// Transform data into object with id as a key and transaction as a value
				map(docs =>
					docs.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {})
				),
				tap(() => (this._isDownloading = false))
			);
	}

	onScroll($event: number) {
		if (this._theEnd) return;

		const total = this.virtualScroll.getDataLength();
		const { end } = this.virtualScroll.getRenderedRange();

		if (total === end && !this._isDownloading) {
			this._offset$.next();
		}
	}

	trackBy(index: number, { id }: ITransaction) {
		return id;
	}

	setFilters(filters: IFilters) {
		this._router.navigate([], {
			relativeTo: this._route,
			queryParams: Object.fromEntries(this._removeUnnecessaryFilters(filters)),
			replaceUrl: true,
		});
	}

	/** Opens dialog containing filters. */
	openFilters() {
		const dialogRef = this._dialog.open(TransactionsFiltersDialogComponent, {
			filters: this._route.snapshot.queryParams,
		});

		dialogRef.afterClosed
			.pipe(
				first(),
				filter(
					(action: IFiltersAction) =>
						action.intention !== FiltersIntention.NoChange
				)
			)
			.subscribe((action: IFiltersAction) => this.setFilters(action.filters));
	}

	private _buildQueries(filters: IFilters, builders: Map<any, any>) {
		return this._removeUnnecessaryFilters(filters)
			.filter(([key]) => builders.has(key))
			.map(([key, value]) => builders.get(key)(value));
	}

	/** Removes filters that does not exist in the QUERIES_BUILDERS, or does not have a value. */
	private _removeUnnecessaryFilters(filters: IFilters) {
		return this._filtersToEntries(filters).filter(([key, value]) =>
			this._isValidFilterValue(value)
		);
	}

	private _filtersToEntries(filters: IFilters): [keyof IFilters, any][] {
		return Object.entries(filters ?? {}) as any;
	}

	private _isValidFilterValue(value: any) {
		return value !== null && value !== '' && value !== '#ignore#';
	}

	/** Indicates if a new batch is being downloaded. */
	get isDownloading() {
		return this._isDownloading;
	}
}
