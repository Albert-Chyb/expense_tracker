import { ITransactionGroup } from './../../common/models/group';
import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './manage-groups.component.html',
	styleUrls: ['./manage-groups.component.scss'],
})
export class ManageGroupsComponent implements OnInit {
	constructor() {}

	groups: ITransactionGroup[] = [
		{
			name: 'Pensja',
			icon: {
				name: 'fa-coins',
				type: 'fas',
			},
		},
		{
			name: 'Jedzenie',
			icon: {
				name: 'fa-utensils',
				type: 'fas',
			},
		},
		{
			icon: {
				type: 'fas',
				name: 'fa-paw',
			},
			name: 'Weterynarz',
		},
	];

	ngOnInit() {}
}
