import { Component, Input } from '@angular/core';
import { zippyAnimation } from 'src/app/animations';

/**
 * Content that will be expanded or collapsed.
 */

@Component({
	selector: 'zippy-content',
	templateUrl: './zippy-content.component.html',
	styleUrls: ['./zippy-content.component.scss'],
	animations: [zippyAnimation],
})
export class ZippyContentComponent {
	constructor() {}

	private _isExpanded = false;

	/**
	 * Sets the state of the zippy.
	 */

	@Input('state') set state(state: boolean) {
		this._isExpanded = state;
	}

	/** Toggles current status of zippy-content */
	toggle() {
		this._isExpanded = !this._isExpanded;
	}

	/** Expands zippy-content */
	expand() {
		this._isExpanded = true;
	}

	/** Collapses zippy-content */
	collapse() {
		this._isExpanded = false;
	}

	/** Informs about current state of zippy-content */
	get isExpanded() {
		return this._isExpanded;
	}
}
