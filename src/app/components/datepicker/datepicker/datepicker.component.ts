import { Component, Input } from '@angular/core';
import {
	IDatepickerPage,
	MonthPage,
	DatepickerPageName,
	datepickerPages,
} from '../datepicker-pages';

@Component({
	selector: 'datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent {
	@Input('min') minDate: Date = new Date(2021, 1, 10, 1, 0, 0, 0);
	@Input('max') maxDate: Date = new Date(2021, 3, 15, 1, 0, 0, 0);
	date = new Date(new Date().setHours(1, 0, 0, 0));
	page: IDatepickerPage = new MonthPage('month', this);

	private readonly _routesOrder = {
		month: 'month',
		chooseYear: 'chooseMonth',
		chooseMonth: 'month',
	};

	/**
	 * Changes the page that is currently visible.
	 * @param pageName Name of the page to switch to.
	 */
	switchPage(pageName: DatepickerPageName) {
		if (pageName === this.page.name) return;

		this.page = new (datepickerPages.get(pageName))(pageName, this);
	}

	/** Function that is called when the button with date is clicked. */
	onMainBtnClick() {
		this.page.name === 'month'
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
		const newDate = new Date(year, month, day, 1, 0, 0, 0);

		if (newDate > this.maxDate || newDate < this.minDate) return;

		this.date = newDate;
	}

	/** Function that is invoked when next button in the template is clicked. */
	next() {
		this.page.next();
	}

	/** Function that is invoked when previous button the in template is clicked. */
	prev() {
		this.page.prev();
	}

	/**
	 * Function that is called when user clicked a cell.
	 * @param cellValue Value of the clicked cell.
	 */
	onCellClick(cellValue: number) {
		if (!this.isSelectable(cellValue)) return;
		this.page.select(cellValue);

		this.switchPage(this._routesOrder[this.page.name]);
	}

	/**
	 * Determines if passed cell value is currently selected.
	 * @param cellValue Value of a cell.
	 */
	isSelected(cellValue: number | string) {
		return this.page.isSelected(cellValue);
	}

	/**
	 * Determines if cell value can be selected.
	 * @param cellValue Value of a cell
	 */
	isSelectable(cellValue: number | string) {
		return this.page.isSelectable(cellValue);
	}

	/** Returns year */
	get year(): number {
		return this.date.getFullYear();
	}
	set year(newYear: number) {
		this.setNewDate(newYear, null, null);
	}

	/** Returns month */
	get month(): number {
		return this.date.getMonth();
	}
	set month(newMonth: number) {
		this.setNewDate(null, newMonth, null);
	}

	/** Returns day of the month */
	get day(): number {
		return this.date.getDate();
	}
	set day(newDay: number) {
		this.setNewDate(null, null, newDay);
	}

	/** Returns day of the week */
	get weekDay(): number {
		return this.date.getDay();
	}
}
