import { Component, Input } from '@angular/core';
import {
	IDatepickerPage,
	ChooseDayPage,
	DatepickerPageName,
	DatepickerPages,
} from '../datepicker-pages';

interface DateParts {
	year?: number;
	month?: number;
	day?: number;
}

const MAX_TIMESTAMP = 8640000000000000;
const MIN_TIMESTAMP = -8640000000000000;

@Component({
	selector: 'datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent {
	@Input('min') minDate: Date = new Date(2020, 1, 25);
	@Input('max') maxDate: Date = new Date(2021, 2, 24);

	date = new Date(new Date().setHours(1, 0, 0, 0));
	page: IDatepickerPage = new ChooseDayPage('month', this);

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

		this.page = new (DatepickerPages.get(pageName))(pageName, this);
	}

	/** Function that is called when the button with date is clicked. */
	onMainBtnClick() {
		this.page.name === 'month'
			? this.switchPage('chooseYear')
			: this.switchPage('month');
	}

	/**
	 * Replaces current date with date build from passed arguments.
	 *
	 * @param dateParts Information about a date that will be used to build the new date.
	 */
	setNewDate(dateParts: DateParts) {
		const { year, month, day } = Object.assign(
			{
				year: this.year,
				month: this.month,
				day: this.day,
			},
			dateParts
		);
		const newDate = new Date(year, month, day, 1, 0, 0, 0);

		this.date = newDate;
	}

	/** Function that is invoked when next button in the template is clicked. */
	next() {
		if (this.page.canGenerateNext) this.page.next();
	}

	/** Function that is invoked when previous button the in template is clicked. */
	prev() {
		if (this.page.canGeneratePrev) this.page.prev();
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
		this.setNewDate({ year: newYear });
	}

	/** Returns month */
	get month(): number {
		return this.date.getMonth();
	}
	set month(newMonth: number) {
		this.setNewDate({ month: newMonth });
	}

	/** Returns day of the month */
	get day(): number {
		return this.date.getDate();
	}
	set day(newDay: number) {
		this.setNewDate({ day: newDay });
	}

	/** Returns day of the week */
	get weekDay(): number {
		return this.date.getDay();
	}
}
