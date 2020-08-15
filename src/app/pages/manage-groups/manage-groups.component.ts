import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';
import { Observable, of } from 'rxjs';
import { ITransactionGroup } from './../../common/models/group';
import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './manage-groups.component.html',
	styleUrls: ['./manage-groups.component.scss'],
})
export class ManageGroupsComponent implements OnInit {
	constructor(private readonly _groups: TransactionsGroupsService) {}

	groups$: Observable<ITransactionGroup[]>;

	ngOnInit() {
		this.groups$ = this._groups.getAll();
	}
}
