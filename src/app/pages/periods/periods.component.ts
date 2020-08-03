import { Component, OnInit } from '@angular/core';

import { IPeriod } from './../../common/models/period';

@Component({
	templateUrl: './periods.component.html',
	styleUrls: ['./periods.component.scss'],
})
export class PeriodsComponent implements OnInit {
	constructor() {}

	periods: IPeriod[] = [
		{
			date: {
				start: new Date('2020 06 13').getTime(),
				end: new Date('2020 07 13').getTime(),
			},
			isClosed: true,
			saved: 400.63,
			spent: 3000.12,
			balance: 8765.88,
		},
		{
			date: {
				start: new Date('2020 07 14').getTime(),
				end: new Date('2020 08 14').getTime(),
			},
			isClosed: true,
			saved: 700.34,
			spent: 2600.55,
			balance: 9765.88,
		},
		{
			date: {
				start: new Date('2020 08 15').getTime(),
				end: new Date('2020 09 15').getTime(),
			},
			isClosed: true,
			saved: 125.34,
			spent: 5000.32,
			balance: 11765.88,
		},
	];

	ngOnInit() {}
}
