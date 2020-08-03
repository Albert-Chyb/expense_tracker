import { Component, OnInit } from '@angular/core';
import {
	trigger,
	state,
	style,
	transition,
	animate,
} from '@angular/animations';

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
export class ZippyContentComponent implements OnInit {
	constructor() {}

	isExpanded = false;

	toggle() {
		this.isExpanded = !this.isExpanded;
	}

	expand() {
		this.isExpanded = true;
	}

	collapse() {
		this.isExpanded = false;
	}

	ngOnInit() {}
}
