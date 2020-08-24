import { Pages } from './../../common/routing/routesUrls';
import { Router } from '@angular/router';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fontAwesomeIconTemplateValidator } from 'src/app/common/validators/fontAwesomeIconTemplateValidator';

import { IFontAwesomeStylePrefix } from './../../common/models/group';
import { ITransaction } from './../../common/models/transaction';

@Component({
	templateUrl: './add-group.component.html',
	styleUrls: ['./add-group.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGroupComponent {
	constructor(
		private readonly _groups: TransactionsGroupsService,
		private readonly _router: Router
	) {}

	form = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.maxLength(64)]),
		icon: new FormControl('', [
			Validators.required,
			fontAwesomeIconTemplateValidator,
			Validators.maxLength(64),
		]),
	});

	async add() {
		const iconClasses = this.normalizeIcon(this.form.value.icon);
		const icon = {
			name: this.form.value.name,
			icon: {
				type: iconClasses[0],
				name: iconClasses[1],
			},
		};

		await this._groups.add(icon);
		this._router.navigateByUrl(Pages.ManageGroups);
	}

	get transaction(): ITransaction {
		const iconClasses = this.normalizeIcon(this.form.value.icon);

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
		const defaultValue = ['fas', 'fa-car'];

		if (!icon || this.form.get('icon').invalid) return defaultValue as any;

		return (icon.match(/\"(.*)\"/)[1].split(' ') || defaultValue) as any;
	}
}
