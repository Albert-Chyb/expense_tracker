import { Observable } from 'rxjs';
import { PeriodsService } from './../../services/periods/periods.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { IClosedPeriod } from './../../common/models/period';

@Component({
	templateUrl: './periods.component.html',
	styleUrls: ['./periods.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodsComponent implements OnInit {
	constructor(private readonly _periods: PeriodsService) {}

	periods$: Observable<IClosedPeriod[]>;

	ngOnInit() {
		this.periods$ = this._periods.getAllClosed();
	}
}
