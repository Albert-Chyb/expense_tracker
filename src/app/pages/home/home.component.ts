import { ITransaction } from './../../common/models/transaction';
import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	constructor() {}

	transactions: ITransaction[];

	ngOnInit() {
		this.transactions = [
			{
				amount: -13.0,
				date: Date.now(),
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
				date: Date.now(),
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
				date: Date.now(),
				description: 'Głowna wypłata z pracy',
				group: {
					name: 'Pensja',
					icon: {
						name: 'fa-coins',
						type: 'fas',
					},
				},
			},
		];
	}
}
