import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IClosedPeriod } from './../../common/models/period';
import { PeriodsService } from './../../services/periods/periods.service';

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
					period.date.end = new firebase.firestore.Timestamp(
						period.date.end.seconds,
						period.date.end.nanoseconds
					);
					period.date.start = new firebase.firestore.Timestamp(
						period.date.start.seconds,
						period.date.start.nanoseconds
					);
					return period;
				})
			)
		);
	}
}
