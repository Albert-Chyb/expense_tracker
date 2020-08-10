import { Component, Input } from '@angular/core';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';

import { ITransactionGroup } from './../../common/models/group';

@Component({
	selector: 'transaction-group',
	templateUrl: './transaction-group.component.html',
	styleUrls: ['./transaction-group.component.scss'],
})
export class TransactionGroupComponent {
	constructor(private readonly _groups: TransactionsGroupsService) {}

	@Input('group') group: ITransactionGroup;
	@Input('onElement') onElement: boolean = false;
	@Input('isEditable') isEditable: boolean = false;

	delete() {
		this._groups.delete(this.group.id);
	}
}
