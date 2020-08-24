import { Pages } from 'src/app/common/routing/routesUrls';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { groupAnimation } from 'src/app/animations';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';

import { ITransactionGroup } from './../../common/models/group';

@Component({
	templateUrl: './manage-groups.component.html',
	styleUrls: ['./manage-groups.component.scss'],
	animations: [groupAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageGroupsComponent implements OnInit {
	constructor(private readonly _groups: TransactionsGroupsService) {}

	groups$: Observable<ITransactionGroup[]>;
	Pages = Pages;

	ngOnInit() {
		this.groups$ = this._groups.getAll();
	}

	trackBy(index: number, group: ITransactionGroup) {
		return group.id;
	}
}
