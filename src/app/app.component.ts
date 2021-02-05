import { registerLocaleData, DOCUMENT } from '@angular/common';
import localePL from '@angular/common/locales/pl';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { functions } from 'firebase';
import { environment } from 'src/environments/environment';

import { routeAnimation } from './animations';
import { DeviceService } from './services/device/device.service';
import { ThemesService } from './services/themes/themes.service';
import { UserService } from './services/user/user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [routeAnimation],
})
export class AppComponent implements OnInit {
	/*
		! Do not remove unused dependencies from constructor.
		! Theirs constructor may contain logic that is required as soon as possible.
		! This is why, they have to be initialized here.
	*/
	constructor(
		private readonly _user: UserService,
		private readonly _themes: ThemesService,
		private readonly _pwaUpdates: SwUpdate,
		private readonly _device: DeviceService,
		@Inject(DOCUMENT) private readonly _docRef: Document
	) {}

	ngOnInit() {
		window['uniqueNumber'] = 0;
		registerLocaleData(localePL);

		// Change to local cloud functions in development environment.
		if (environment.firebaseEmulators.enabled)
			functions().useFunctionsEmulator('http://localhost:5001');

		this.listenForPWAUpdates();
	}

	prepareRoute(outlet: RouterOutlet) {
		return (
			outlet && outlet.activatedRouteData && outlet.activatedRouteData.name
		);
	}

	listenForPWAUpdates() {
		if (!this._device.isInstalledOnDevice) return;
		this._pwaUpdates.available.subscribe(() => this._docRef.location.reload());
		this._pwaUpdates.checkForUpdate();
	}
}
