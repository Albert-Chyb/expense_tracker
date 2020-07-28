import { Component, OnInit, Input } from '@angular/core';

type styledInputAppearance = 'outline' | 'filled';

@Component({
	selector: 'styled-input',
	templateUrl: './styled-input.component.html',
	styleUrls: ['./styled-input.component.scss'],
})
export class StyledInputComponent implements OnInit {
	constructor() {}

	@Input('appearance') appearance: styledInputAppearance = 'outline';

	ngOnInit() {}

	get classes() {
		return [`styled-input--${this.appearance}`];
	}
}
