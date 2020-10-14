import { fadeIn, fadeOut } from './../../animations';
import { DeviceService } from './../../services/device/device.service';
import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
} from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { UserService } from './../../services/user/user.service';
import { Title } from '@angular/platform-browser';
import { Pages } from 'src/app/common/routing/routesUrls';
import { IUser } from 'src/app/common/models/user';
import { transition, trigger, useAnimation } from '@angular/animations';

@Component({
	selector: 'main-header',
	templateUrl: './main-header.component.html',
	styleUrls: ['./main-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('offlineInfoAnimation', [
			transition(':enter', useAnimation(fadeIn)),
			transition(':leave', useAnimation(fadeOut)),
		]),
	],
})
export class MainHeaderComponent implements OnInit {
	constructor(
		private readonly _router: Router,
		private readonly _user: UserService,
		private readonly _tabTitle: Title,
		private readonly _device: DeviceService,
		private readonly _changeDetector: ChangeDetectorRef
	) {}

	pageName$: Observable<string>;
	isLoggedIn$: Observable<boolean>;
	isOnline: boolean = true;
	user$: Observable<IUser>;
	Pages = Pages;

	ngOnInit() {
		this.pageName$ = this._router.events.pipe(
			filter(event => event instanceof ActivationEnd),
			map((event: ActivationEnd) => (event.snapshot.data.name as string) || ''),
			tap(routeName =>
				this._tabTitle.setTitle(`Monitor wydatków - ${routeName}`)
			)
		);

		this.isLoggedIn$ = this._user.isLoggedIn$;
		this.user$ = this._user.user$;

		this._device.connectionStatus$.subscribe(
			this.onConnectionStatusChange.bind(this)
		);
	}

	private onConnectionStatusChange(isOnline: boolean): void {
		this.isOnline = isOnline;

		this._changeDetector.detectChanges();
	}
}
