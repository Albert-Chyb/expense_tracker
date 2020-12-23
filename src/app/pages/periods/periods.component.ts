import { firestore } from 'firebase';
import { tap, map } from 'rxjs/operators';
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
		this.periods$ = this._periods.getAllClosed().pipe(
			map(periods =>
				periods.map(period => {
					period.date.end = new firestore.Timestamp(
						period.date.end.seconds,
						period.date.end.nanoseconds
					);
					period.date.start = new firestore.Timestamp(
						period.date.start.seconds,
						period.date.start.nanoseconds
					);
					return period;
				})
			)
		);
	}
}
