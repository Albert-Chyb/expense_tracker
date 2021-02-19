import { DatePipe } from '@angular/common';
import {
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
import { fromEvent, merge, Subscription } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';

import { DatepickerManager } from './datepicker/datepicker.component';

/**
 * Directive that provides custom value accessor for the input that is connected with datepicker.
 * It provides date object for NgControl while allowing to display date in input as a string.
 */
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
	private _datepickerRef: DatepickerManager;
	private readonly _dateRanges = {
		minDate: new Date(-8640000000000000),
		maxDate: new Date(8640000000000000),
	};

	@Input('min') set minDate(date: Date) {
		this._target.minDate = date;
	}

	@Input('max') set maxDate(date: Date) {
		this._target.maxDate = date;
	}

	@Input('datepicker') set datepicker(ref: DatepickerManager) {
		const ngControl = this._injector.get(NgControl);
		this._datepickerRef = ref;
		ref.ngControl = ngControl;
		ref.maxDate = this._dateRanges.maxDate;
		ref.minDate = this._dateRanges.minDate;
	}

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

	private get _target() {
		return this._datepickerRef ?? this._dateRanges;
	}

	private _dateToView(date: Date | number | string) {
		return this._datePipe.transform(date, 'yyyy-MM-dd');
	}
}
