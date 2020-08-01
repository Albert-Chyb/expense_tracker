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
			name: 'Imprezy',
			icon: {
				name: 'fa-coins',
				type: 'fas',
			},
		},

		{
			name: 'Weterynarz',
			icon: {
				name: 'fa-paw',
				type: 'fas',
			},
		},

		{
			name: 'Pensja',
			icon: {
				name: 'fa-coins',
				type: 'fas',
			},
		},
	];

	ngOnInit() {}
}
