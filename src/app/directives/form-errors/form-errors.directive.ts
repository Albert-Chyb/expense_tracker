import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
	selector: '[formErrors]',
})
export class FormErrorsDirective {
	constructor(private readonly control: NgControl) {}

	called = false;

	@HostListener('blur') onBlur() {
		if (this.called || this.control.valid) return;
		this.called = true;
		this.control.control.updateValueAndValidity();
	}
}
