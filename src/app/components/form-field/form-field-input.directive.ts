import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { fromEvent, merge, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { FormFieldControl } from './form-field-control';

@Directive({
	selector: 'input[formFieldInput]',
	host: {
		class: 'form-field-input',
	},
})
export class FormFieldInputDirective implements FormFieldControl {
	constructor(
		private readonly _ngControl: NgControl,
		private readonly _hostEl: ElementRef<HTMLInputElement>
	) {}

	private _onStateChange = merge(
		fromEvent(this._hostEl.nativeElement, 'blur'),
		fromEvent(this._hostEl.nativeElement, 'focus')
	).pipe(mapTo(null));

	private get _isFocused() {
		return this._hostEl.nativeElement.matches(':focus');
	}

	get shouldLabelFloat(): boolean {
		return this._isFocused || this.value !== '';
	}

	get value(): string {
		return this._hostEl.nativeElement.value;
	}
	set value(newValue: string) {
		this._hostEl.nativeElement.value = newValue;
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
