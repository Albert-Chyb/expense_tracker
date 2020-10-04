import { Component, Input, OnInit } from '@angular/core';

import { ITransactionGroupIcon } from './../../common/models/group';

type GroupIconType = 'income' | 'outcome' | 'neutral';

@Component({
	selector: 'group-icon',
	templateUrl: './group-icon.component.html',
	styleUrls: ['./group-icon.component.scss'],
})
export class GroupIconComponent implements OnInit {
	constructor() {}

	@Input('icon') icon: ITransactionGroupIcon;
	@Input('type') type: GroupIconType;

	ngOnInit() {}

	get classes() {
		return [this.icon.type, this.icon.name, `group-icon--${this.type}`];
	}
}
