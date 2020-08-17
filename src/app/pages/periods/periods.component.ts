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
				start: new Date('2020/06/13'),
				end: new Date('2020/07/13'),
			},
			isClosed: true,
			incomes: 400.63,
			outcomes: 3000.12,
			balance: 8765.88,
		},
		{
			date: {
				start: new Date('2020/07/14'),
				end: new Date('2020/08/14'),
			},
			isClosed: true,
			incomes: 700.34,
			outcomes: 2600.55,
			balance: 9765.88,
		},
		{
			date: {
				start: new Date('2020/08/15'),
				end: new Date('2020/09/15'),
			},
			isClosed: true,
			incomes: 125.34,
			outcomes: 5000.32,
			balance: 11765.88,
		},
	];

	ngOnInit() {}
}
