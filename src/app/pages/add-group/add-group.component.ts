import { IFontAwesomeStylePrefix } from './../../common/models/group';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ITransaction } from './../../common/models/transaction';

@Component({
	templateUrl: './add-group.component.html',
	styleUrls: ['./add-group.component.scss'],
})
export class AddGroupComponent implements OnInit {
	constructor() {}

	private defaultIconLayout = '<i class="fas fa-glass-cheers"></i>';

	form = new FormGroup({
		name: new FormControl(),
		icon: new FormControl(),
	});

	ngOnInit() {}

	get transaction(): ITransaction {
		const iconClasses = this.normalizeIcon(
			this.form.value.icon || this.defaultIconLayout
		);

		return {
			amount: 23.33,
			date: null,
			description: 'Opis tej transakcji',
			group: {
				name: this.form.value.name || 'Imprezy',
				icon: {
					name: iconClasses[1],
					type: iconClasses[0],
				},
			},
		};
	}

	private normalizeIcon(icon: string): [IFontAwesomeStylePrefix, string] {
		const defaultValue = ['', ''];
		if (!icon) return defaultValue as any;
		return (icon.match(/\"(.*)\"/)[1].split(' ') || defaultValue) as any;
	}
}
