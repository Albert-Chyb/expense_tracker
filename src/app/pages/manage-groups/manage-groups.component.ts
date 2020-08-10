import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';
import { Observable } from 'rxjs';
import { ITransactionGroup } from './../../common/models/group';
import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './manage-groups.component.html',
	styleUrls: ['./manage-groups.component.scss'],
})
export class ManageGroupsComponent implements OnInit {
	constructor(private readonly _groups: TransactionsGroupsService) {}

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

	groups$: Observable<ITransactionGroup[]>;

	ngOnInit() {
		this.groups$ = this._groups.getAll();
	}
}
