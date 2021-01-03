import { Directive, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { fromEvent, merge, Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

import { FormFieldControl } from './form-field-control';

@Directive({
	selector: 'input[formFieldInput]',
	host: {
		class: 'form-field-input',
	},
	providers: [
		{
			provide: FormFieldControl,
			useExisting: FormFieldInputDirective,
		},
	],
})
export class FormFieldInputDirective implements FormFieldControl {
	constructor(
		private readonly _ngControl: NgControl,
		private readonly _hostEl: ElementRef<HTMLInputElement>
	) {}

	private _onStateChange = merge(
		fromEvent(this._hostEl.nativeElement, 'blur').pipe(mapTo(false)),
		fromEvent(this._hostEl.nativeElement, 'focus').pipe(mapTo(true))
	).pipe(
		tap(isFocused => (this._isFocused = isFocused)),
		mapTo(null)
	);

	private _isFocused: boolean;

	get shouldLabelFloat(): boolean {
		return this._isFocused || this.value !== '';
	}

	get value(): string {
		return this._hostEl.nativeElement.value;
	}

	get isFocused() {
		return this._isFocused;
	}

	get ngControl() {
		return this._ngControl;
	}

	get onStateChange(): Observable<void> {
		return this._onStateChange;
	}

	onContainerClick() {
		this._hostEl.nativeElement.focus();
	}
}
