import { ITransaction } from './../../common/models/transaction';
import { Component, OnInit } from '@angular/core';
import groupBy from 'src/app/common/helpers/groupBy';
import isToday from 'src/app/common/helpers/isToday';

@Component({
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	constructor() {}

	private _groupedTransactions: Map<string, ITransaction[]>;
	isToday = isToday;

	ngOnInit() {
		const data: ITransaction[] = [
			{
				amount: -13.0,
				date: new Date('2020/09/13').getTime(),
				description: 'Wyjście ze znajomymi',
				group: {
					name: 'Jedzenie',
					icon: {
						name: 'fa-utensils',
						type: 'fas',
					},
				},
			},
			{
				amount: -43.73,
				date: new Date('2020/09/13').getTime(),
				description: 'Coroczne szczepienie psa',
				group: {
					name: 'Weterynarz',
					icon: {
						name: 'fa-paw',
						type: 'fas',
					},
				},
			},
			{
				amount: 3600.0,
				date: new Date('2020/08/04').getTime(),
				description: 'Głowna wypłata z pracy',
				group: {
					name: 'Pensja',
					icon: {
						name: 'fa-coins',
						type: 'fas',
					},
				},
			},
			{
				amount: 25.99,
				date: new Date('2020/08/04').getTime(),
				description: 'Naprawa okularów',
				group: {
					name: 'Osobiste',
					icon: {
						name: 'fa-glasses',
						type: 'fas',
					},
				},
			},
		];

		this._groupedTransactions = groupBy<ITransaction>(data, 'date');
	}

	get groupedTransactions() {
		return Array.from(this._groupedTransactions).sort(
			(a: any, b: any) => a[0] - b[0]
		);
	}
}
