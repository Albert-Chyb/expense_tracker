import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { UserService } from './../../services/user/user.service';
import { Title } from '@angular/platform-browser';
import { Pages } from 'src/app/common/routing/routesUrls';

@Component({
	selector: 'main-header',
	templateUrl: './main-header.component.html',
	styleUrls: ['./main-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHeaderComponent implements OnInit {
	constructor(
		private readonly _router: Router,
		public readonly _user: UserService,
		private readonly tabTitle: Title
	) {}

	pageName$: Observable<string>;
	isLoggedIn$: Observable<boolean>;
	Pages = Pages;

	ngOnInit() {
		this.pageName$ = this._router.events.pipe(
			filter(event => event instanceof ActivationEnd),
			map((event: ActivationEnd) => (event.snapshot.data.name as string) || ''),
			tap(routeName =>
				this.tabTitle.setTitle(`Monitor wydatków - ${routeName}`)
			)
		);

		this.isLoggedIn$ = this._user.isLoggedIn$;
	}
}
