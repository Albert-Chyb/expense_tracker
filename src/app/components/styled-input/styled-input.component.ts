import { AfterContentInit, Component, ContentChild } from '@angular/core';

import { StyledInputDirective } from './../../directives/styled-input/styled-input.directive';

@Component({
	selector: 'styled-input',
	templateUrl: './styled-input.component.html',
	styleUrls: ['./styled-input.component.scss'],
})
export class StyledInputComponent implements AfterContentInit {
	constructor() {}

	@ContentChild(StyledInputDirective, { static: true })
	input: StyledInputDirective;

	ngAfterContentInit() {}

	get classes() {
		return {
			'styled-input--invalid': this.input.control.invalid,
			'styled-input--valid': this.input.control.valid,
			'styled-input--touched': this.input.control.touched,
			'styled-input--untouched': this.input.control.untouched,
			'styled-input--focused': this.input.isFocused,
		};
	}
}
