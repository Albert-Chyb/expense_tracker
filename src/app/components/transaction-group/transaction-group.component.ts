import { ITransactionGroup } from './../../common/models/group';
import { Component, OnInit, Input, HostBinding } from '@angular/core';

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
