import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { Component } from '@angular/core';

@Component({
	selector: 'zippy-content',
	templateUrl: './zippy-content.component.html',
	styleUrls: ['./zippy-content.component.scss'],
	animations: [
		trigger('zippyAnimation', [
			state('collapsed', style({ height: 0, opacity: 0 })),

			transition('collapsed => expanded', animate('200ms ease-out')),
			transition('expanded => collapsed', animate('200ms ease-in')),
		]),
	],
})
export class ZippyContentComponent {
	constructor() {}

	private _isExpanded = false;

	toggle() {
		this._isExpanded = !this._isExpanded;
	}

	expand() {
		this._isExpanded = true;
	}

	collapse() {
		this._isExpanded = false;
	}

	get isExpanded() {
		return this._isExpanded;
	}
}
