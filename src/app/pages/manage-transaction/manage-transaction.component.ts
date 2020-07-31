import { Component, OnInit } from '@angular/core';

import { ITransactionGroup } from './../../common/models/group';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
	templateUrl: './manage-transaction.component.html',
	styleUrls: ['./manage-transaction.component.scss'],
})
export class ManageTransactionComponent implements OnInit {
	constructor() {}

	form = new FormGroup({
		group: new FormControl('5'),
		amount: new FormControl(),
		date: new FormControl(),
		description: new FormControl(),
	});

	groups: ITransactionGroup[] = [
		{
			name: 'Jedzenie',
			id: '1',
			icon: {
				name: 'fa-utensils',
				type: 'fas',
			},
		},
		{
			name: 'Weterynarz',
			id: '2',
			icon: {
				name: 'fa-paw',
				type: 'fas',
			},
		},
		{
			name: 'Pensja',
			id: '3',
			icon: {
				name: 'fa-coins',
				type: 'fas',
			},
		},
	];

	ngOnInit() {}
}
