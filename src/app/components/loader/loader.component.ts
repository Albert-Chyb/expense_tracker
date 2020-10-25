import { Component, Input } from '@angular/core';

/**
 * Loader indicates that something is loading.
 */
@Component({
	selector: 'loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
	constructor() {}

	/**
	 * If true loader is centered based on closest relative parent.
	 */
	@Input('isCentered') isCenteredAbsolutely = false;

	/**
	 * If true loader is centered based on window.
	 */
	@Input('isFixed') isFixed = false;

	get classes() {
		return {
			'loader-container--fixed': this.isFixed,
			'loader-container--centered': this.isCenteredAbsolutely,
		};
	}
}
