import { Component, Input } from '@angular/core';
import { Confirmable } from 'src/app/services/dialog/dialog.service';
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
	@Input('isEditable') isEditable: boolean = false;

	@Confirmable({
		title: 'Potwierdź usunięcie grupy',
		description:
			'Czy napewno chcesz usunąć ta grupę ? Nie będzie można jej później przywrócić.',
	})
	delete() {
		this._delete();
	}

	private _delete() {
		this._groups.delete(this.group.id);
	}
}
