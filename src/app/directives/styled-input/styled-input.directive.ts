import {
	Directive,
	ElementRef,
	HostBinding,
	HostListener,
	Input,
	OnInit,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
	selector: '[styledInput]',
})
export class StyledInputDirective implements OnInit {
	constructor(
		private readonly _host: ElementRef<HTMLInputElement>,
		private readonly _control: NgControl
	) {}

	@Input('placeholder') set placeholder(value: string) {
		this._host.nativeElement.placeholder = value || ' ';
	}
	@HostBinding('class') private hostClass = 'styled-input__input';
	@HostListener('blur') private onBlur() {
		this.isFocused = false;
	}
	@HostListener('focus') private onFocus() {
		this.isFocused = true;
	}

	isFocused: boolean;

	ngOnInit() {
		if (!this._host.nativeElement.placeholder) this.placeholder = ' ';
	}

	get control() {
		return this._control;
	}
}
