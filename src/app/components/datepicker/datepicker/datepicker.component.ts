import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
	Component,
	ComponentRef,
	Directive,
	HostListener,
	Inject,
	InjectionToken,
	Injector,
	Input,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

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

interface IDatepickerInputs {
	minDate: Date;
	maxDate: Date;
	ngControl: NgControl;
}
export const DATEPICKER_INPUTS = new InjectionToken('DATEPICKER_INPUTS');
const MAX_TIMESTAMP = 8640000000000000;
const MIN_TIMESTAMP = -8640000000000000;

/*
	TODO: Use OnPush change detection.
*/

/**
 * Datepicker helps selecting a date in the form field input.
 *
 * It is meant to replace standard datepicker that is available in the browser.
 */

@Component({
	selector: '',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit, OnDestroy {
	constructor(
		@Inject(DATEPICKER_INPUTS)
		private readonly _inputs: IDatepickerInputs
	) {}

	@Input('min')
	set minDate(date: Date) {
		if (date >= this.maxDate)
			throw new Error('Tried to set min date that is later than max date !');

		if (date instanceof Date) this._rangeDates.min = date;
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

		if (date instanceof Date) this._rangeDates.max = date;
	}
	get maxDate() {
		return this._rangeDates.max;
	}

	/** NgControl of associated input. */
	private _ngControl: NgControl;
	private _date = new Date(new Date().setHours(0, 0, 0, 0));
	private _page: IDatepickerPage = new ChooseDayPage(this);
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
		this.minDate = this._inputs.minDate;
		this.maxDate = this._inputs.maxDate;
		this.ngControl = this._inputs.ngControl;

		this._subscriptions.add(
			this._ngControl.valueChanges.subscribe((date: Date) => (this.date = date))
		);

		this.date = this._ngControl.value;
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	/**
	 * Changes the page that is currently visible.
	 * @param pageName Name of the page to switch to.
	 */
	switchPage(pageName: DatepickerPageName) {
		if (pageName === this._page.name) return;
		if (!DatepickerPages.has(pageName))
			throw new Error(`No page with given name (${pageName}) !`);

		this._page = new (DatepickerPages.get(pageName))(this);
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

		this._date = this._determineDate(newDate);
		this._ngControl.control.setValue(this._date);
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
	 * Determines if the cell value can be selected.
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
		return this._date.getFullYear();
	}
	set year(newYear: number) {
		this.setNewDate({ year: newYear });
	}

	/** Returns the month */
	get month(): number {
		return this._date.getMonth();
	}
	set month(newMonth: number) {
		this.setNewDate({ month: newMonth });
	}

	/** Returns day of the month */
	get day(): number {
		return this._date.getDate();
	}
	set day(newDay: number) {
		this.setNewDate({ day: newDay });
	}

	/** Returns day of the week */
	get weekDay(): number {
		return this._date.getDay();
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

	/** Currently selected date. */
	get date() {
		return this._date;
	}
	set date(date: Date) {
		this._date = this._determineDate(date);
	}

	/**
	 * It does not allow to set a date that is outside of the range.
	 * @param date Date that is meant to be set.
	 */
	private _determineDate(date: Date): Date {
		let newDate: Date;

		if (!date) newDate = this._date;
		else if (this.isInRange(date)) newDate = date;
		else if (date > this.maxDate) newDate = this.maxDate;
		else if (date < this.minDate) newDate = this.minDate;

		return newDate;
	}
}

/** Allows opening assigned datepicker. */
@Directive({
	selector: '[triggerDatepicker]',
})
export class TriggerDatepickerDirective {
	@Input('triggerDatepicker') datepickerManager: DatepickerManager;

	@HostListener('click', ['$event'])
	open($event: MouseEvent) {
		$event.stopPropagation();
		this.datepickerManager.open();
	}
}

/**
 * Datepicker manager is a bridge between template and opened overlay.
 * It reflects changes in inputs on datepicker instance.
 */
@Component({
	selector: 'datepicker',
	template: '',
})
export class DatepickerManager {
	constructor(
		private readonly _injector: Injector,
		private readonly _cdkOverlay: Overlay
	) {}

	private readonly _inputs: IDatepickerInputs = {
		minDate: new Date(MIN_TIMESTAMP),
		maxDate: new Date(MAX_TIMESTAMP),
		ngControl: null,
	};
	private _isOpened = false;
	private _datepickerRef: DatepickerComponent;
	private _overlayRef: OverlayRef;

	set minDate(minDate: Date) {
		this._target.minDate = minDate;
	}

	set maxDate(maxDate: Date) {
		this._target.maxDate = maxDate;
	}

	set ngControl(ngControl: NgControl) {
		this._target.ngControl = ngControl;
	}

	@HostListener('click')
	open() {
		if (this._isOpened) return;

		this._isOpened = true;

		const [overlay, attachment] = this._createOverlay();
		this._overlayRef = overlay;
		this._datepickerRef = attachment.instance;

		overlay
			.backdropClick()
			.pipe(take(1))
			.subscribe(() => this.close());
	}

	close() {
		if (this._isClosed) return;

		this._isOpened = false;
		this._overlayRef.dispose();
		this._overlayRef = null;
		this._datepickerRef = null;
	}

	private _createInjector() {
		return Injector.create({
			providers: [{ provide: DATEPICKER_INPUTS, useValue: this._inputs }],
			parent: this._injector,
		});
	}

	private _createOverlay(): [OverlayRef, ComponentRef<DatepickerComponent>] {
		const overlay = this._cdkOverlay.create(this._buildOverlayConfig());

		const attachment = overlay.attach(
			new ComponentPortal(DatepickerComponent, null, this._createInjector())
		);

		return [overlay, attachment];
	}

	private _buildOverlayConfig(): OverlayConfig {
		return {
			hasBackdrop: true,
			positionStrategy: this._cdkOverlay
				.position()
				.global()
				.centerHorizontally()
				.centerVertically(),
			scrollStrategy: this._cdkOverlay.scrollStrategies.block(),
		};
	}

	private get _isClosed() {
		return !this._isOpened;
	}

	private get _target() {
		return this._datepickerRef ?? this._inputs;
	}
}
