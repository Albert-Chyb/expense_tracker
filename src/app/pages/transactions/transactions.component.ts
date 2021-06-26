import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewChild,
} from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { filter, first, map, mapTo, mergeMap, scan, tap } from 'rxjs/operators';
import { ITransaction } from 'src/app/common/models/transaction';
import {
	limit,
	orderBy,
	startAfter,
	where,
} from 'src/app/services/collection-base/dynamic-queries/helpers';
import { DynamicQuery } from 'src/app/services/collection-base/dynamic-queries/models';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

import {
	FiltersIntention,
	IFilters,
	IFiltersMetadata,
	TransactionsFiltersDialogComponent,
	TransactionsType,
} from '../../components/transactions-filters-dialog/transactions-filters-dialog.component';

const QUERIES = new Map<keyof IFilters, (value: any) => DynamicQuery>([
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
		private readonly _dialog: DialogService,
		private readonly _overlay: OverlayService
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
	/** Resets all stored transactions */
	private readonly _reset$ = new Subject<void>();
	/** Contains all transactions stored so far */
	transactions$: Observable<ITransaction[]>;
	/** Whenever filters change */
	filters$ = new BehaviorSubject<IFilters>(null);

	ngOnInit() {
		const offset$ = this._offset$.pipe(
			tap(() => (this._isDownloading = true)),
			mergeMap(() => this.getNextTransactions()),
			map(current => previous => ({ ...previous, ...current }))
		);
		const reset$ = this._reset$.pipe(
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
	getNextTransactions(): Observable<{ [id: string]: ITransaction }> {
		return this._transactions
			.querySnapshots(
				limit(this._batchSize),
				orderBy('amount', 'desc'),
				orderBy('date', 'desc'),
				this._lastSeen ? startAfter(this._lastSeen) : [],
				this.filters ? this._buildQueries(this.filters) : []
			)
			.pipe(
				// Save last received document for startAfter query.
				tap(({ docs }) => (this._lastSeen = docs[docs.length - 1])),
				// Convert snapshots into document data
				map(({ docs }) =>
					docs.map(doc => ({
						id: doc.id,
						...doc.data(),
					}))
				),
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
		this.filters$.next(filters);
		this._reset$.next();
	}

	/** Opens dialog with filters. */
	openFilters() {
		const dialogRef = this._dialog.open(TransactionsFiltersDialogComponent, {
			filters: this.filters$.value,
		});
		this._overlay.onClick$.subscribe(() => {
			const action: IFiltersMetadata = {
				filters: null,
				intention: FiltersIntention.NoChange,
			};

			return dialogRef.closeWith(action);
		});

		dialogRef.afterClosed
			.pipe(
				first(),
				filter(
					(action: IFiltersMetadata) =>
						action.intention !== FiltersIntention.NoChange
				)
			)
			.subscribe((action: IFiltersMetadata) => this.setFilters(action.filters));
	}

	private _buildQueries(filters: IFilters) {
		return Object.entries(filters)
			.filter(
				([key, value]) =>
					QUERIES.has(<any>key) && !!value && value !== '#ignore#'
			)
			.map(([key, value]) => QUERIES.get(<keyof IFilters>key)(value));
	}

	/** Indicates if new batch is being downloaded. */
	get isDownloading() {
		return this._isDownloading;
	}

	/** Currently set filters. */
	get filters() {
		return this.filters$.value;
	}
}
