import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
	constructor(private readonly _changeDetector: ChangeDetectorRef) {}

	mode: string = 'progress';
	value: number = 20;
	maxValue: number = 100;
	displayProgress = true;

	ngOnInit() {
		// this._changeDetector.detach();

		setTimeout(() => {
			this.value = 80;
		}, 2000);
	}
}
