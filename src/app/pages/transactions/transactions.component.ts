import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewChild,
} from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import {
	BehaviorSubject,
	combineLatest,
	merge,
	Observable,
	Subject,
} from 'rxjs';
import { filter, first, map, mapTo, mergeMap, scan, tap } from 'rxjs/operators';
import { ITransactionGroup } from 'src/app/common/models/group';
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
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

import {
	FiltersIntention,
	IFilters,
	IFiltersMetadata,
	TransactionsFilterComponent,
	TransactionsType,
} from './transactions-filter.component';

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
		private readonly _groups: TransactionsGroupsService,
		private readonly _dialog: DialogService,
		private readonly _overlay: OverlayService
	) {}

	@ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

	private readonly _callLimit = 20;
	private _isDownloading = false;
	private _theEnd = false;
	private _lastSeen: QueryDocumentSnapshot<ITransaction>;

	offset$ = new BehaviorSubject<void>(null);
	transactions$: Observable<ITransaction[]>;
	transactionsReset$ = new Subject<void>();
	filters$ = new BehaviorSubject<IFilters>(null);

	groups$ = this._groups.getAll();
	data$: Observable<{
		transactions: ITransaction[];
		groups: ITransactionGroup[];
	}>;

	ngOnInit() {
		const offset$ = this.offset$.pipe(
			mergeMap(() => this.getNextTransactions()),
			map(current => previous => ({ ...previous, ...current }))
		);
		const transactionsReset$ = this.transactionsReset$.pipe(
			tap(() => {
				this._theEnd = false;
				this._lastSeen = null;
				this.offset$.next();
			}),
			mapTo(() => ({}))
		);

		this.transactions$ = merge(offset$, transactionsReset$).pipe(
			scan((acc, action) => action(acc), {}),
			map(t => Object.values(t))
		);
		this.data$ = combineLatest([this.transactions$, this.groups$]).pipe(
			map(([transactions, groups]) => ({ transactions, groups }))
		);
	}

	getNextTransactions(): Observable<{ [id: string]: ITransaction }> {
		this._isDownloading = true;

		return this._transactions
			.querySnapshots(
				limit(this._callLimit),
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
			this.offset$.next();
		}
	}

	trackBy(index: number, { id }: ITransaction) {
		return id;
	}

	setFilters(filters: IFilters) {
		this.filters$.next(filters);
		this.transactionsReset$.next();
	}

	openFilters() {
		const dialogRef = this._dialog.open(TransactionsFilterComponent, {
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

	get isDownloadingNewTransactions() {
		return this._isDownloading;
	}

	get filters() {
		return this.filters$.value;
	}
}
