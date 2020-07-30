import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControlDirective, FormControl } from '@angular/forms';

@Component({
	templateUrl: './manage-transaction.component.html',
	styleUrls: ['./manage-transaction.component.scss'],
})
export class ManageTransactionComponent implements OnInit {
	constructor() {}

	form = new FormGroup({
		group: new FormControl(1),
	});

	groups = [1, 2, 3];

	ngOnInit() {}
}
