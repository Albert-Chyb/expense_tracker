import { MainNavService } from './../../services/main-nav/main-nav.service';
import { NavbarButton } from './../../common/models/navbarButton';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from './../../services/user/user.service';
import { Pages } from './../../common/routing/routesUrls';
import {
	AfterViewInit,
	Component,
	ElementRef,
	ViewChild,
	Renderer2,
	RendererStyleFlags2,
	OnInit,
} from '@angular/core';

@Component({
	selector: 'main-nav',
	templateUrl: './main-nav.component.html',
	styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements AfterViewInit, OnInit {
	constructor(
		private readonly _user: UserService,
		private readonly _router: Router,
		private readonly _renderer: Renderer2,
		private readonly _mainNav: MainNavService
	) {}

	@ViewChild('programmableButton', { read: ElementRef })
	programmableButton: ElementRef<HTMLButtonElement>;

	Pages = Pages;
	isLoggedIn$ = this._user.isLoggedIn$;
	private readonly defaultButton: NavbarButton = {
		iconUnicode: '\\f0fe',
		description: 'Dodaj transakcję',
		onClick: () => this._router.navigateByUrl(this.Pages.AddTransaction),
	};
	button: NavbarButton = this.defaultButton;

	changeButton(newButton: NavbarButton) {
		this.button = newButton;
	}

	restoreDefaultButton() {
		this.button = this.defaultButton;
	}

	async ngAfterViewInit() {
		await this.isLoggedIn$.pipe(first()).toPromise();
		this._renderer.setStyle(
			this.programmableButton.nativeElement,
			'--icon',
			`'${this.button.iconUnicode}'`,
			RendererStyleFlags2.DashCase
		);
	}

	ngOnInit() {
		this._mainNav.changeButtonBroadcaster$.subscribe(
			this.changeButton.bind(this)
		);
		this._mainNav.resetButtonBroadcaster$.subscribe(
			this.restoreDefaultButton.bind(this)
		);
	}
}
