import { Directive, HostBinding } from '@angular/core';

@Directive({
	selector: '[styledInputSuffix]',
})
export class StyledInputSuffixDirective {
	constructor() {}

	@HostBinding('class.styled-input__suffix') class = true;
}
