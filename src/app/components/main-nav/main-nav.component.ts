import { UserService } from './../../services/user/user.service';
import { Pages } from './../../common/routing/routesUrls';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'main-nav',
	templateUrl: './main-nav.component.html',
	styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {
	constructor(private readonly _user: UserService) {}

	Pages = Pages;
	isLoggedIn$ = this._user.isLoggedIn$;

	ngOnInit(): void {}
}
