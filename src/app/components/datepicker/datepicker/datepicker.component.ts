import { isDateWithinRange } from './../../../common/validators/isDateWithinRange';
import { isValidDate } from './../../../common/validators/isValidDate';
import { DatePipe } from '@angular/common';
import {
	Component,
	Directive,
	ElementRef,
	forwardRef,
	Injector,
	Input,
	OnDestroy,
	OnInit,
} from '@angular/core';
import {
	ControlValueAccessor,
	NG_VALUE_ACCESSOR,
	NgControl,
} from '@angular/forms';
import { fromEvent, merge, Observable, Subject, Subscription } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';

import {
	ChooseDayPage,
	DatepickerPageName,
	DatepickerPages,
	IDatepickerPage,
} from '../datepicker-pages';

interface DateParts {
	year?: number;
	month?: number;
	day?: number;
}

const MAX_TIMESTAMP = 8640000000000000;
const MIN_TIMESTAMP = -8640000000000000;

/**
 * TODO: Write validators to check if date is valid, is withing the range.
 * Datepicker helps selecting a date in the form field input.
 * When you attach it to an input it will register validators that check
 * if entered value is a valid date string.
 *
 * It is meant to replace standard datepicker that is available in browser.
 */

@Component({
	selector: 'datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
	@Input('min')
	set minDate(date: Date) {
		if (date >= this.maxDate)
			throw new Error('Tried to set min date that is later than max date !');

		this._rangeDates.min = date;
	}
	/** The earliest date that can be selected. */
	get minDate() {
		return this._rangeDates.min;
	}

	/** The latest date that can be selected. */
	@Input('max')
	set maxDate(date: Date) {
		if (date <= this.minDate)
			throw new Error('Tried to set max date that is earlier than min date !');

		this._rangeDates.max = date;
	}
	get maxDate() {
		return this._rangeDates.max;
	}

	/** Currently selected date. */
	date = new Date(new Date().setHours(0, 0, 0, 0));

	/** NgControl of associated input. */
	private _ngControl: NgControl;
	private _page: IDatepickerPage = new ChooseDayPage('chooseDay', this);
	private readonly _subscriptions = new Subscription();
	private readonly _onValueChanges = new Subject<Date>();
	private readonly _routesOrder = {
		chooseDay: 'chooseDay',
		chooseYear: 'chooseMonth',
		chooseMonth: 'chooseDay',
	};
	private readonly _rangeDates = {
		min: new Date(MIN_TIMESTAMP),
		max: new Date(MAX_TIMESTAMP),
	};

	ngOnInit() {
		this._subscriptions.add(
			this._ngControl.valueChanges.subscribe((date: Date) => {
				if (date && this.isInRange(date)) this.date = date;
			})
		);
		this.date = this._ngControl.value;

		this._ngControl.control.setValidators([
			isValidDate,
			isDateWithinRange(this._rangeDates),
		]);
	}

	/**
	 * Changes the page that is currently visible.
	 * @param pageName Name of the page to switch to.
	 */
	switchPage(pageName: DatepickerPageName) {
		if (pageName === this._page.name) return;
		if (!DatepickerPages.has(pageName))
			throw new Error(`No page with given name (${pageName}) !`);

		this._page = new (DatepickerPages.get(pageName))(pageName, this);
	}

	/** Function that is called when the button with date is clicked. */
	onMainBtnClick() {
		this._page.name === 'chooseDay'
			? this.switchPage('chooseYear')
			: this.switchPage('chooseDay');
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
		const newDate = new Date(year, month, day);

		this.date = newDate;
		this._ngControl.control.setValue(this.date);
	}

	/** Function that is invoked when next button in the template is clicked. */
	next() {
		if (this._page.canGenerateNext) this._page.next();
	}

	/** Function that is invoked when previous button the in template is clicked. */
	prev() {
		if (this._page.canGeneratePrev) this._page.prev();
	}

	/**
	 * Function that is called when user clicked a cell.
	 * @param cellValue Value of the clicked cell.
	 */
	onCellClick(cellValue: number) {
		if (!this.isSelectable(cellValue)) return;
		this._page.select(cellValue);

		this.switchPage(this._routesOrder[this._page.name]);
	}

	/**
	 * Determines if passed cell value is currently selected.
	 * @param cellValue Value of a cell.
	 */
	isSelected(cellValue: number | string) {
		return this._page.isSelected(cellValue);
	}

	/**
	 * Determines if cell value can be selected.
	 * @param cellValue Value of a cell
	 */
	isSelectable(cellValue: number | string) {
		return this._page.isSelectable(cellValue) && cellValue !== 0;
	}

	/**
	 * Checks if a date is contained within min and max Date.
	 * @param date Date to check if it`s in range
	 */
	isInRange(date: Date) {
		return date >= this.minDate && date <= this.maxDate;
	}

	/** Returns the year */
	get year(): number {
		return this.date.getFullYear();
	}
	set year(newYear: number) {
		this.setNewDate({ year: newYear });
	}

	/** Returns the month */
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

	/** Whether head data is present. */
	get hasHeadData(): boolean {
		return this._page.hasHeadData;
	}

	/** Data that should be displayed as headings. */
	get headData() {
		return this._page.headData;
	}

	/** Data of the current page. */
	get data() {
		return this._page.data;
	}

	/** Whether previous set of data of the current page can be generated. */
	get canGeneratePrev() {
		return this._page.canGeneratePrev;
	}

	/** Whether next set of data of the current page can be generated. */
	get canGenerateNext() {
		return this._page.canGenerateNext;
	}

	/** Emits every time a new date is selected. */
	get onValueChanges(): Observable<Date> {
		return this._onValueChanges;
	}

	/** Setter of the associated input`s NgControl */
	set ngControl(ngControlRef: NgControl) {
		this._ngControl = ngControlRef;
	}
}

@Directive({
	selector: 'input[datepicker]',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DatepickerInputDirective),
			multi: true,
		},
	],
})
export class DatepickerInputDirective
	implements ControlValueAccessor, OnInit, OnDestroy {
	constructor(
		private readonly _inputElRef: ElementRef<HTMLInputElement>,
		private readonly _injector: Injector
	) {}

	private readonly _datePipe = new DatePipe(navigator.language);
	private readonly _onStateChange = merge(
		fromEvent(this._input, 'focus').pipe(mapTo(true)),
		fromEvent(this._input, 'blur').pipe(mapTo(false))
	);
	private readonly _subscriptions = new Subscription();
	private _onChange: Function;
	private _onTouch: Function;

	writeValue(date: Date): void {
		this._input.value = this._dateToView(date);
	}

	registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this._onTouch = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this._input.disabled = isDisabled;
	}

	ngOnInit() {
		this._subscriptions.add(
			this._onStateChange.subscribe(() => this._onTouch())
		);

		this._subscriptions.add(
			this._onStateChange
				.pipe(filter(isFocused => !isFocused))
				.subscribe(() => {
					if (!Date.parse(this.value)) return this._onChange(null);

					const viewDate = this._dateToView(this.value);
					const date = new Date(viewDate);
					this.value = viewDate;

					date.setHours(0, 0, 0, 0);
					this._onChange(date);
				})
		);
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	get value(): string {
		return this._input.value;
	}
	set value(newValue: string) {
		this._input.value = newValue;
	}

	private get _input() {
		return this._inputElRef.nativeElement;
	}

	private _dateToView(date: Date | number | string) {
		return this._datePipe.transform(date, 'yyyy-MM-dd');
	}
}
