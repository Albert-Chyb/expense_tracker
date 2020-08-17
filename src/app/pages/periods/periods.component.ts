import { Observable } from 'rxjs';
import { PeriodsService } from './../../services/periods/periods.service';
import { Component, OnInit } from '@angular/core';

import { IPeriod } from './../../common/models/period';

@Component({
	templateUrl: './periods.component.html',
	styleUrls: ['./periods.component.scss'],
})
export class PeriodsComponent implements OnInit {
	constructor(private readonly _periods: PeriodsService) {}

	periods$: Observable<IPeriod[]>;

	ngOnInit() {
		this.periods$ = this._periods.getAllClosed();
	}
}
