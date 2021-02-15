import { DatepickerComponent } from './datepicker/datepicker.component';

export type DatepickerPageName = 'month' | 'chooseYear' | 'chooseMonth';

export interface IDatepickerPage {
	next(): void;
	prev(): void;
	isSelected(cellValue: number | string): boolean;
	select(cellValue: number | string): void;
	isSelectable(cellValue: number | string): boolean;
	name: string;
	data: any[][];
	headData: any[];
	hasHeadData: boolean;
	canGenerateNext: boolean;
	canGeneratePrev: boolean;
}

export abstract class DatepickerPage {
	constructor(
		public name: DatepickerPageName,
		protected readonly hostRef: DatepickerComponent
	) {}
	/** Data of this page. The data is represented as 2D array. */
	data = [[]];

	/** Data that describes each column in data property. */
	headData = [];

	get hasHeadData() {
		return this.headData.length > 0;
	}

	/** Function generates next set of data. */
	next() {}

	/** Function generates previous set of data. */
	prev() {}

	/**
	 * Turns 1D array into 2D by grouping data into rows.
	 * Each row is represented as a array.
	 * @param array Array to group
	 * @param rowSize Number of items in a single row
	 * @param startAt Index of the starting point in the grouped array. (default is 0)
	 * @param emptyValue Fill blank spaces in a row with this value
	 * @param equalLastRowSize If there is no enough data in the last row start inserting empty value to complete it.
	 */
	protected _transformIntoTable<T>(
		array: T[],
		rowSize: number,
		startAt = 0,
		emptyValue: any = 0,
		equalLastRowSize: boolean = false
	): Array<Array<T>> {
		if (array.length === 0) return [[]];
		let index = 0;
		let row = 0;
		const newArray: Array<Array<T>> = [[]];
		const lastRowEmptyCells = rowSize - (array.length % rowSize || rowSize);
		const endingIndex = equalLastRowSize
			? array.length + lastRowEmptyCells
			: array.length;

		while (index < endingIndex) {
			if (index !== 0 && index % rowSize === 0) newArray[++row] = [];

			const itemToInsert =
				index < startAt ? emptyValue : array[index] ?? emptyValue;

			newArray[row].push(itemToInsert);
			index++;
		}

		return newArray;
	}

	/**
	 * Checks if a date is contained within min and max Date.
	 * @param date Date to check if it`s in range
	 */
	protected _isInRange(date: Date) {
		const { minDate, maxDate } = this.hostRef;

		return date >= minDate && date <= maxDate;
	}
}

export class ChooseDayPage extends DatepickerPage implements IDatepickerPage {
	constructor(name: DatepickerPageName, hostRef: DatepickerComponent) {
		super(name, hostRef);
		this.data = this._generateMonth();
	}
	data: number[][];
	headData = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];

	next() {
		this.hostRef.month += 1;
		this.data = this._generateMonth();
	}

	prev() {
		this.hostRef.month -= 1;
		this.data = this._generateMonth();
	}

	isSelected(day: number) {
		return day === this.hostRef.day;
	}

	select(day: number) {
		this.hostRef.day = day;
	}

	isSelectable(day: number) {
		const { year, month } = this.hostRef;
		const date = new Date(year, month, day);

		return this._isInRange(date);
	}

	get canGenerateNext(): boolean {
		const { year, month } = this.hostRef;
		const date = new Date(year, month + 1, 1);

		return this._isInRange(date);
	}

	get canGeneratePrev(): boolean {
		const { year, month } = this.hostRef;
		const date = new Date(year, month - 1, new Date(year, month, 0).getDate());

		return this._isInRange(date);
	}

	/**
	 * Generates 2D array with rows as weeks.
	 * Each day in a week is placed at its proper index relative to name of the day (Monday, Tuesday...).
	 * Number 0 means empty place.
	 */
	private _generateMonth(): Array<Array<number>> {
		const numberOfDays = this._numbersOfDays();
		const firstDayIndex = this._firstDayIndex();
		const month = new Array(numberOfDays + firstDayIndex).fill(
			0,
			0,
			firstDayIndex
		);

		for (let i = firstDayIndex; i < numberOfDays + firstDayIndex; i++)
			month[i] = i - firstDayIndex + 1;

		return this._transformIntoTable(
			month,
			this.headData.length,
			firstDayIndex,
			0,
			true
		);
	}

	/** Returns number of days in the current month. */
	private _numbersOfDays() {
		const date = new Date(this.hostRef.date);
		date.setMonth(date.getMonth() + 1);
		date.setDate(0);

		return date.getDate();
	}

	/** Returns position of the first day in first week */
	private _firstDayIndex() {
		return (
			new Date(
				this.hostRef.date.getFullYear(),
				this.hostRef.date.getMonth(),
				1
			).getDay() - 1
		);
	}
}

export class ChooseMonthPage extends DatepickerPage implements IDatepickerPage {
	canGenerateNext = false;
	canGeneratePrev = false;
	data = [
		['Styczeń', 'Luty', 'Marzec', 'Kwiecień'],
		['Maj', 'Czerwiec', 'Lipiec', 'Sierpień'],
		['Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
	];

	private readonly _months = this.data.flat(Infinity);

	isSelected(month: string) {
		const monthIndex = this._getMonthIndex(month);
		return monthIndex === this.hostRef.month;
	}

	select(month: string) {
		this.hostRef.month = this._getMonthIndex(month);
	}

	isSelectable(month: string) {
		const monthIndex = this._getMonthIndex(month);
		const minDay =
			monthIndex === this.hostRef.minDate.getMonth()
				? this.hostRef.minDate.getDate()
				: -Infinity;

		const day = Math.max(1, minDay);
		return this._isInRange(new Date(this.hostRef.year, monthIndex, day));
	}

	private _getMonthIndex(month: string) {
		return this._months.indexOf(month);
	}
}

export class ChooseYearPage extends DatepickerPage implements IDatepickerPage {
	constructor(name: DatepickerPageName, hostRef: DatepickerComponent) {
		super(name, hostRef);
		this.data = this._generateYears();
	}
	private _startYear: number = this.hostRef.year;
	private readonly _yearsPerPage = 12;
	data: number[][];

	next() {
		this._startYear += this._yearsPerPage;
		this.data = this._generateYears();
	}

	prev() {
		this._startYear -= this._yearsPerPage;
		this.data = this._generateYears();
	}

	isSelected(year: number) {
		return year === this.hostRef.year;
	}

	select(year: number) {
		this.hostRef.year = year;
	}

	isSelectable(year: number) {
		return this._isYearInRange(year);
	}

	get canGeneratePrev() {
		return this._isYearInRange(this.data[0][0] - 1);
	}

	get canGenerateNext() {
		const lastYearIndex = this.data[this.data.length - 1].length - 1;

		return this._isYearInRange(
			this.data[this.data.length - 1][lastYearIndex] + 1
		);
	}

	private _generateYears() {
		const data = [];
		for (
			let i = this._startYear;
			i < this._startYear + this._yearsPerPage;
			i++
		) {
			data.push(i);
		}

		return this._transformIntoTable(data, 4, 0, 0, false);
	}

	private _isYearInRange(year: number): boolean {
		const minYear = this.hostRef.minDate.getFullYear();
		const maxYear = this.hostRef.maxDate.getFullYear();

		return year >= minYear && year <= maxYear;
	}
}

export const DatepickerPages = new Map<DatepickerPageName, any>([
	['month', ChooseDayPage],
	['chooseYear', ChooseYearPage],
	['chooseMonth', ChooseMonthPage],
]);
