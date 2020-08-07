import { NgControl } from '@angular/forms';
import {
	Directive,
	HostBinding,
	Input,
	ElementRef,
	OnInit,
} from '@angular/core';

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
	@HostBinding('class.styled-input__input') true = true;

	ngOnInit() {
		if (!this._host.nativeElement.placeholder) this.placeholder = ' ';
	}

	get control() {
		return this._control;
	}
}
