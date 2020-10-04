import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { groupAnimation } from 'src/app/animations';
import { Pages } from 'src/app/common/routing/routesUrls';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';

import { ITransactionGroup } from './../../common/models/group';
import { NavbarLink } from './../../common/models/navbarButton';
import { MainNavService } from './../../services/main-nav/main-nav.service';

@Component({
	templateUrl: './manage-groups.component.html',
	styleUrls: ['./manage-groups.component.scss'],
	animations: [groupAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageGroupsComponent implements OnInit, OnDestroy {
	constructor(
		private readonly _groups: TransactionsGroupsService,
		private readonly _mainNav: MainNavService
	) {}

	groups$: Observable<ITransactionGroup[]>;
	Pages = Pages;

	ngOnInit() {
		this.groups$ = this._groups.getAll();

		const addGroupButton: NavbarLink = {
			description: 'Dodaj grupę',
			iconUnicode: '\\f0fe',
			route: Pages.AddGroup,
		};
		this._mainNav.changeButton(addGroupButton);
	}

	ngOnDestroy() {
		this._mainNav.resetButton();
	}

	trackBy(index: number, group: ITransactionGroup) {
		return group.id;
	}
}
