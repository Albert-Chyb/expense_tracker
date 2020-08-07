import {
	AfterContentInit,
	Component,
	ContentChild,
	Input,
} from '@angular/core';

import { StyledInputDirective } from './../../directives/styled-input/styled-input.directive';

type styledInputAppearance = 'outline' | 'filled';

@Component({
	selector: 'styled-input',
	templateUrl: './styled-input.component.html',
	styleUrls: ['./styled-input.component.scss'],
})
export class StyledInputComponent implements AfterContentInit {
	constructor() {}

	@ContentChild(StyledInputDirective, { static: true })
	input: StyledInputDirective;

	@Input('appearance') appearance: styledInputAppearance = 'outline';

	ngAfterContentInit() {
		console.log(this.input);
	}

	get classes() {
		return {
			[`styled-input--${this.appearance}`]: true,
			'styled-input--invalid': this.input.control.invalid,
			'styled-input--valid': this.input.control.valid,
			'styled-input--touched': this.input.control.touched,
			'styled-input--untouched': this.input.control.untouched,
		};
	}
}
