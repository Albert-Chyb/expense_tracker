import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
	constructor(private readonly _changeDetector: ChangeDetectorRef) {}

	ngOnInit() {
		// this._changeDetector.detach();
	}
}
