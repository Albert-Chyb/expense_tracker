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
	@Input('displayPlaceholder') displayPlaceholder: boolean = false;

	ngOnInit() {}
}
