import { Component, Input, OnInit } from '@angular/core';

import { ITransactionGroup } from './../../common/models/group';

@Component({
	selector: 'transaction-group',
	templateUrl: './transaction-group.component.html',
	styleUrls: ['./transaction-group.component.scss'],
})
export class TransactionGroupComponent implements OnInit {
	constructor() {}

	@Input('group') group: ITransactionGroup;
	@Input('onElement') onElement: boolean = false;
	@Input('isEditable') isEditable: boolean = false;

	ngOnInit() {}
}
