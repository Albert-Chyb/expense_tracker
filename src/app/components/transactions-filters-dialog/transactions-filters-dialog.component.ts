import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DIALOG_DATA, DIALOG_REF } from 'src/app/common/models/dialog';
import { lesserThanValidator } from 'src/app/common/validators/lesserThanValidator';
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
export type TFiltersEntries = [keyof IFilters, any][];

interface IDialogData {
	filters: IFilters;
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
		date: new FormGroup(
			{
				earliestDate: new FormControl(),
				latestDate: new FormControl(),
			},
			lesserThanValidator('earliestDate', 'latestDate')
		),
		amount: new FormGroup(
			{
				lowestAmount: new FormControl(),
				highestAmount: new FormControl(),
			},
			lesserThanValidator('lowestAmount', 'highestAmount')
		),
		group: new FormControl(),
		type: new FormControl(TransactionsType.All),
	});

	get hasFilters() {
		return Object.values(this.getFilters()).some(
			filter => !!filter || filter === 0
		);
	}

	ngOnInit() {
		this.filters.patchValue(this._dialogData.filters, { emitEvent: false });
	}

	close() {
		this._dialogRef.closeWith(
			this._removeUnnecessaryFilters(this._dialogData.filters)
		);
	}

	closeWithFilters() {
		this._dialogRef.closeWith(
			this._removeUnnecessaryFilters(this.getFilters())
		);
	}

	getFilters() {
		const {
			group,
			type,
			date: { earliestDate, latestDate },
			amount: { lowestAmount, highestAmount },
		} = this.filters.value;

		return {
			group,
			type,
			earliestDate,
			latestDate,
			lowestAmount,
			highestAmount,
		};
	}

	private _removeUnnecessaryFilters(filters: IFilters): IFilters {
		const entries = this._filtersToEntries(filters).filter(([key, value]) =>
			this._isValidFilterValue(value)
		);

		return Object.fromEntries(entries) as any;
	}

	private _filtersToEntries(filters: IFilters): [keyof IFilters, any][] {
		return Object.entries(filters ?? {}) as any;
	}

	private _isValidFilterValue(value: any) {
		return value !== null && value !== '' && value !== '#ignore#';
	}
}
