import { Component, Input } from '@angular/core';

/**
 * Gives clue to the user about something.
 *
 * For example when you display data that may not be created yet,
 * instead of displaying empty page you could give the user a clue that
 * no data is available yet.
 */

@Component({
	selector: 'clue',
	templateUrl: './clue.component.html',
	styleUrls: ['./clue.component.scss'],
})
export class ClueComponent {
	/** Path to clue image */
	@Input('imgSrc') imgSrc: string;

	/** If true, the clue will be centered based on window */
	@Input('isFixed') isFixed: boolean = false;
}
