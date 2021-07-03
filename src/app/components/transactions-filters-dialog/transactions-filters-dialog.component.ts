import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DIALOG_DATA, DIALOG_REF } from 'src/app/common/models/dialog';
import { DialogContainerComponent } from 'src/app/components/dialog-container/dialog-container.component';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';

export enum TransactionsType {
	All = '#ignore#',
	Expenses = 'expenses',
	Incomes = 'incomes',
}

export interface IFilters {
	earliestDate: Date;
	latestDate: Date;
	lowestAmount: number;
	highestAmount: number;
	group: string;
	type: TransactionsType;
}

interface IDialogData {
	filters: Partial<IFilters>;
}

export enum FiltersIntention {
	/** Filters should be applied */
	Apply = 'apply',

	/** Filters should be removed */
	Reset = 'reset',

	/** No change in filters should be made. */
	NoChange = 'no-change',
}

export interface IFiltersAction {
	filters: IFilters | null;
	intention: FiltersIntention;
}

@Component({
	templateUrl: `./transactions-filters-dialog.component.html`,
	styleUrls: [`./transactions-filters-dialog.component.scss`],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsFiltersDialogComponent implements OnInit {
	constructor(
		@Inject(DIALOG_REF) private readonly _dialogRef: DialogContainerComponent,
		@Inject(DIALOG_DATA) private readonly _dialogData: IDialogData,
		private readonly _groups: TransactionsGroupsService
	) {}

	groups$ = this._groups.getAll();

	filters = new FormGroup({
		earliestDate: new FormControl(),
		latestDate: new FormControl(),
		lowestAmount: new FormControl(),
		highestAmount: new FormControl(),
		group: new FormControl(),
		description: new FormControl(),
		type: new FormControl(TransactionsType.All),
	});

	get hasFilters() {
		return Object.values(this.filters.value).some(
			filter => !!filter || filter === 0
		);
	}

	ngOnInit() {
		this.filters.patchValue(this._dialogData.filters, { emitEvent: false });
	}

	apply() {
		const action: IFiltersAction = {
			filters: this.filters.value,
			intention: FiltersIntention.Apply,
		};

		this._dialogRef.closeWith(action);
	}

	reset() {
		const action: IFiltersAction = {
			filters: null,
			intention: FiltersIntention.Reset,
		};

		this._dialogRef.closeWith(action);
	}

	close() {
		const action: IFiltersAction = {
			filters: null,
			intention: FiltersIntention.NoChange,
		};

		this._dialogRef.closeWith(action);
	}
}
