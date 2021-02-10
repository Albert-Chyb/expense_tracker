import { Component, OnInit } from '@angular/core';

type DatepickerPageName = 'month' | 'chooseYear' | 'chooseMonth';
interface IDatepickerPage {
	next(): void;
	prev(): void;
	name: string;
	data: any[][];
	headData: any[];
	hasHeadData: boolean;
}

abstract class DatepickerPage {
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
	protected groupIntoRows<T>(
		array: T[],
		rowSize: number,
		startAt = 0,
		emptyValue: any,
		equalLastRowSize: boolean
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
}

class MonthPage extends DatepickerPage implements IDatepickerPage {
	constructor(name: DatepickerPageName, hostRef: DatepickerComponent) {
		super(name, hostRef);
		this.data = this._generateMonth();
	}
	data: number[][];
	headData = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];

	next() {
		this.hostRef.nextMonth();
		this.data = this._generateMonth();
	}

	prev() {
		this.hostRef.prevMonth();
		this.data = this._generateMonth();
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

		return this.groupIntoRows(
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

class ChooseYearPage extends DatepickerPage implements IDatepickerPage {
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

	private _generateYears() {
		const data = [];
		for (
			let i = this._startYear;
			i < this._startYear + this._yearsPerPage;
			i++
		) {
			data.push(i);
		}

		return this.groupIntoRows(data, 4, 0, 0, false);
	}
}

class ChooseMonthPage extends DatepickerPage implements IDatepickerPage {
	data = [
		['Styczeń', 'Luty', 'Marzec', 'Kwiecień'],
		['Maj', 'Czerwiec', 'Lipiec', 'Sierpień'],
		['Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
	];
}

const datepickerPages = new Map<DatepickerPageName, any>([
	['month', MonthPage],
	['chooseYear', ChooseYearPage],
	['chooseMonth', ChooseMonthPage],
]);

@Component({
	selector: 'datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
	constructor() {}

	date = new Date();
	currentPage: IDatepickerPage = new MonthPage('month', this);

	ngOnInit(): void {}

	/**
	 * Changes the page that is currently visible.
	 * @param pageName Name of the page to switch to.
	 */
	switchPage(pageName: DatepickerPageName) {
		this.currentPage = new (datepickerPages.get(pageName))(pageName, this);
	}

	/** Function that is called when the button with date is clicked. */
	onMainBtnClick() {
		this.currentPage.name === 'month'
			? this.switchPage('chooseYear')
			: this.switchPage('month');
	}

	/**
	 * Replaces current date with date build from passed arguments.
	 * Not every argument is required, if you don't want to change a certain value just pass null as a value.
	 *
	 * @param newYear Year to switch to
	 * @param newMonth Month to switch to
	 * @param newDay Day to switch to
	 */
	setNewDate(newYear?: number, newMonth?: number, newDay?: number) {
		const year = newYear ?? this.year;
		const month = newMonth ?? this.month;
		const day = newDay ?? this.day;

		this.date = new Date(year, month, day, 0, 0, 0, 0);
	}

	/** Switches to the next month. */
	nextMonth() {
		this.setNewDate(null, this.month + 1, null);
	}

	/** Switches to the previous month. */
	prevMonth() {
		this.setNewDate(null, this.month - 1, null);
	}

	/** Function that is invoked when next button in the template is clicked. */
	next() {
		this.currentPage.next();
	}

	/** Function that is invoked when previous button the in template is clicked. */
	prev() {
		this.currentPage.prev();
	}

	/** Returns currently chosen year */
	get year(): number {
		return this.date.getFullYear();
	}

	/** Returns currently chosen month */
	get month(): number {
		return this.date.getMonth();
	}

	/** Returns currently chosen day of the month */
	get day(): number {
		return this.date.getDate();
	}

	/** Returns currently chosen day of the week */
	get weekDay(): number {
		return this.date.getDay();
	}
}
