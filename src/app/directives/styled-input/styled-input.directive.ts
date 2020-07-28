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
	constructor(private readonly host: ElementRef<HTMLInputElement>) {}

	@Input('placeholder') set placeholder(value: string) {
		this.host.nativeElement.placeholder = value || ' ';
	}
	@HostBinding('class.styled-input__input') true = true;

	ngOnInit() {
		if (!this.host.nativeElement.placeholder) this.placeholder = ' ';
	}
}
