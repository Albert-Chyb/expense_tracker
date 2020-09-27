import { Router } from '@angular/router';
import { NavbarButton } from './../../common/models/navbarButton';
import { MainNavService } from './../../services/main-nav/main-nav.service';
import { Pages } from 'src/app/common/routing/routesUrls';
import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	OnDestroy,
} from '@angular/core';
import { Observable } from 'rxjs';
import { groupAnimation } from 'src/app/animations';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';

import { ITransactionGroup } from './../../common/models/group';

@Component({
	templateUrl: './manage-groups.component.html',
	styleUrls: ['./manage-groups.component.scss'],
	animations: [groupAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageGroupsComponent implements OnInit, OnDestroy {
	constructor(
		private readonly _groups: TransactionsGroupsService,
		private readonly _mainNav: MainNavService,
		private readonly _router: Router
	) {}

	groups$: Observable<ITransactionGroup[]>;
	Pages = Pages;

	ngOnInit() {
		this.groups$ = this._groups.getAll();

		const addGroupButton: NavbarButton = {
			description: 'Dodaj grupę',
			iconUnicode: '\\f0fe',
			onClick: () => this._router.navigateByUrl(Pages.AddGroup),
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
