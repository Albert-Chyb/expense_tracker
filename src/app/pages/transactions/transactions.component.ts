import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import {
	debounceTime,
	first,
	map,
	mapTo,
	mergeMap,
	scan,
	switchMap,
	switchMapTo,
	takeUntil,
	tap,
} from 'rxjs/operators';
import { distinctUntilKeysChanged } from 'src/app/common/helpers/distinctUntilKeysChanged';
import { pick } from 'src/app/common/helpers/pick';
import { ITransaction } from 'src/app/common/models/transaction';
import {
	limit,
	orderBy,
	startAfter,
} from 'src/app/services/collection-base/dynamic-queries/helpers';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

import {
	IFilters,
	TransactionsFiltersDialogComponent,
} from '../../components/transactions-filters-dialog/transactions-filters-dialog.component';
import {
	FILTERS_KEYS,
	LOCAL_QUERIES,
	SERVER_QUERIES,
	VIRTUAL_SCROLL_ITEM_SIZE,
} from './constants';

@Component({
	templateUrl: './transactions.component.html',
	styleUrls: ['./transactions.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnInit, OnDestroy {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _dialog: DialogService,
		private readonly _route: ActivatedRoute,
		private readonly _router: Router
	) {}

	/** (Angular Material CDK) Virtual scroll container reference. */
	@ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

	/** Emits whenever new transactions should be downloaded. */
	private readonly _offset$ = new BehaviorSubject<void>(null);
	/** For takeUntil operator. */
	private readonly _destroy$ = new Subject();
	/** How many documents should be included in a single batch. */
	private readonly _batchSize = 20;

	/** Indicates if a new batch is being downloaded. */
	private _isDownloading = false;
	/** Indicates if the end of the collection has been reached. */
	private _theEnd = false;
	/** Last document in the last batch. */
	private _lastSeen: QueryDocumentSnapshot<ITransaction>;

	/** Contains all transactions stored so far. */
	public transactions$: Observable<ITransaction[]>;

	ngOnInit() {
		const filters$: Observable<IFilters> = this._route.queryParams.pipe(
			distinctUntilKeysChanged<IFilters>(FILTERS_KEYS)
		);
		const localFilters$: Observable<any> = filters$.pipe(
			distinctUntilKeysChanged<IFilters>([...LOCAL_QUERIES.keys()]),
			map(filters => pick(filters, [...LOCAL_QUERIES.keys()]))
		);
		const serverFilters$: Observable<any> = filters$.pipe(
			distinctUntilKeysChanged<IFilters>([...SERVER_QUERIES.keys()]),
			map(filters => pick(filters, [...SERVER_QUERIES.keys()]))
		);
		const offset$ = this._offset$.pipe(
			tap(() => (this._isDownloading = true)),
			switchMapTo(serverFilters$),
			mergeMap((filters: IFilters) => this.getNextTransactions(filters)),
			map(current => (previous: any) => ({ ...previous, ...current }))
		);
		const reset$ = serverFilters$.pipe(
			tap(() => {
				this._theEnd = false;
				this._lastSeen = null;
				this._offset$.next();
			}),
			mapTo(() => ({}))
		);

		fromEvent(window, 'resize')
			.pipe(takeUntil(this._destroy$), debounceTime(200))
			.subscribe(() => {
				this.virtualScroll && !this._isViewportScrollable() && this.onScroll();
			});

		this.transactions$ = merge(offset$, reset$).pipe(
			scan((acc, action) => action(acc), {}),
			map(t => Object.values(t)),
			switchMap((transactions: ITransaction[]) =>
				localFilters$.pipe(
					map(filters => {
						const filtered = this._filterTransactions(filters, transactions);

						if (filtered.length === 0 && this._canStartDownloadingNext) {
							this._offset$.next();
						}

						return filtered;
					})
				)
			),
			tap(
				/*
					Sometimes first batch of items is not enough to make virtual scroll viewport show scrollbar.
					Because of that user is stuck with first batch, because method onScroll is called only when the viewport is scrolled.
					To prevent that we call onScroll method manually until user is able to scroll the items.
				*/
				() =>
					this.virtualScroll && !this._isViewportScrollable() && this.onScroll()
			)
		);
	}

	ngOnDestroy() {
		this._destroy$.next();
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
				map(({ docs }) =>
					docs.map(doc => ({
						id: doc.id,
						...doc.data(),
					}))
				),
				// Receiving no items, means there are no items left to download.
				tap(r => (r.length > 0 ? null : (this._theEnd = true))),
				// Transform data into object with id as a key and transaction as a value
				map(docs =>
					docs.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {})
				),
				tap(() => (this._isDownloading = false))
			);
	}

	onScroll() {
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
			queryParams: filters,
			replaceUrl: true,
		});
	}

	/** Opens dialog containing filters. */
	openFilters() {
		const dialogRef = this._dialog.open(TransactionsFiltersDialogComponent, {
			filters: this._route.snapshot.queryParams,
		});

		dialogRef.afterClosed
			.pipe(first())
			.subscribe((filters: IFilters) => this.setFilters(filters));
	}

	private _buildQueries(filters: IFilters, builders: Map<any, any>) {
		return Object.entries(filters)
			.filter(([key]) => builders.has(key))
			.map(([key, value]) => builders.get(key)(value));
	}

	private _filterTransactions(filters: IFilters, transactions: ITransaction[]) {
		const queries = this._buildQueries(filters, LOCAL_QUERIES);
		let filtered = transactions;

		if (queries.length > 0) {
			filtered = filtered.filter(transaction =>
				queries.every(query => query(transaction))
			);
		}

		return filtered;
	}

	/**
	 * Checks if virtual scroll container can be scrolled.
	 * @returns True if view is scrollable.
	 */
	private _isViewportScrollable() {
		const viewportSize = this.virtualScroll?.getViewportSize() ?? 0;
		const { start, end } = this.virtualScroll?.getRenderedRange() ?? {
			start: 0,
			end: 0,
		};
		const allItemsSize = (end - start) * VIRTUAL_SCROLL_ITEM_SIZE;

		return allItemsSize > viewportSize;
	}

	/** Indicates if a new batch is being downloaded. */
	get isDownloading() {
		return this._isDownloading;
	}

	private get _canStartDownloadingNext() {
		return !this._isDownloading && !this._theEnd;
	}
}
