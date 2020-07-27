import { Component, Input, OnInit } from '@angular/core';

import { ITransaction } from './../../common/models/transaction';

@Component({
	selector: 'transaction-card',
	templateUrl: './transaction-card.component.html',
	styleUrls: ['./transaction-card.component.scss'],
})
export class TransactionCardComponent implements OnInit {
	constructor() {}

	@Input('transaction') transaction: ITransaction;

	ngOnInit() {}

	get iconClasses() {
		return {
			'transaction__icon--income': this.transaction.amount > 0,
			'transaction__icon--outcome': this.transaction.amount < 0,
			[this.transaction.group.icon.type]: true,
			[this.transaction.group.icon.name]: true,
		};
	}
}
