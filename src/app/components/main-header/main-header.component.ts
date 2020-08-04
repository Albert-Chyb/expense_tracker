import { UserService } from './../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Component({
	selector: 'main-header',
	templateUrl: './main-header.component.html',
	styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {
	constructor(
		private readonly _router: Router,
		public readonly _user: UserService
	) {}

	pageName$: Observable<string>;
	isLoggedIn$: Observable<boolean>;

	ngOnInit() {
		this.pageName$ = this._router.events.pipe(
			filter(event => event instanceof ActivationEnd),
			map((event: ActivationEnd) => (event.snapshot.data.name as string) || '')
		);

		this.isLoggedIn$ = this._user.isLoggedIn$;
	}
}
