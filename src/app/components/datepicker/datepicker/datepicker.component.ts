import { DatePipe } from '@angular/common';
import {
	Component,
	Directive,
	ElementRef,
	forwardRef,
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
 */

@Component({
	selector: 'datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
	/** The earliest date that can be selected. */
	@Input('min') minDate: Date = new Date(2020, 1, 25);

	/** The latest date that can be selected. */
	@Input('max') maxDate: Date = new Date(2021, 2, 24);

	/** Currently selected date. */
	date = new Date(new Date().setHours(0, 0, 0, 0));
	page: IDatepickerPage = new ChooseDayPage('month', this);

	/** NgControl of associated input. */
	private _ngControl: NgControl;
	private readonly _subscriptions = new Subscription();
	private readonly _onValueChanges = new Subject<Date>();
	private readonly _routesOrder = {
		month: 'month',
		chooseYear: 'chooseMonth',
		chooseMonth: 'month',
	};

	ngOnInit() {
		this._subscriptions.add(
			this._ngControl.valueChanges.subscribe((date: Date) => {
				this.date = date;
			})
		);
		this.date = this._ngControl.value;
	}

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
		const newDate = new Date(year, month, day);

		this.date = newDate;
		this._ngControl.control.setValue(this.date);
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
		return this.page.isSelectable(cellValue) && cellValue !== 0;
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
	constructor(private readonly _inputElRef: ElementRef<HTMLInputElement>) {}

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
