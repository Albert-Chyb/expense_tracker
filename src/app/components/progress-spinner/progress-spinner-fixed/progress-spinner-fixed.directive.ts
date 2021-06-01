import { Directive } from '@angular/core';

@Directive({
	selector: 'progress-spinner[fixed]',
	host: {
		'[class.progress-spinner--fixed]': 'true',
	},
})
export class ProgressSpinnerFixedDirective {}
