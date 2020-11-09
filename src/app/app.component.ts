import { LoaderComponent } from './components/loader/loader.component';
import { OverlayService } from './services/overlay/overlay.service';
import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { functions } from 'firebase';
import { environment } from 'src/environments/environment';

import { routeAnimation } from './animations';
import { DeviceService } from './services/device/device.service';
import { FormErrorsService } from './services/form-errors/form-errors.service';
import { ThemesService } from './services/themes/themes.service';
import { UserService } from './services/user/user.service';

@Component({
	template: '<h1>Jakiś tekst tutaj !!!</h1>',
})
class TestComponent implements OnDestroy {
	ngOnDestroy() {
		console.log('I am destroyed');
	}
}

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
		private readonly _formErrors: FormErrorsService,
		private readonly _pwaUpdates: SwUpdate,
		private readonly _device: DeviceService,
		private readonly _overlay: OverlayService
	) {}

	ngOnInit() {
		window['uniqueNumber'] = 0;

		this._overlay.open(LoaderComponent);

		setTimeout(() => this._overlay.close(), 5000);

		registerLocaleData(localePL);

		// Change to local cloud functions in development environment.
		if (environment.firebaseEmulators.enabled)
			functions().useFunctionsEmulator('http://localhost:5001');

		this.listenForPWAUpdates();

		this._formErrors
			.add('required', 'To pole jest wymagane')
			.add('blackList', 'Podana wartość nie jest właściwa')
			.add('maxlength', 'Za długi tekst')
			.add('isNaN', 'Podana wartośc nie jest liczbą')
			.add(
				'invalidFontAwesomeTemplate',
				'Podana wartośc nie jest poprawnym schematem ikony'
			)
			.add('whiteList', 'Podana wartośc nie jest właściwa');
	}

	prepareRoute(outlet: RouterOutlet) {
		return (
			outlet && outlet.activatedRouteData && outlet.activatedRouteData.name
		);
	}

	listenForPWAUpdates() {
		if (!this._device.isInstalledOnDevice) return;
		this._pwaUpdates.available.subscribe(() => {
			const userAgreedToUpdateApp = confirm(
				'Nowa wersja aplikacji jest dostępna ! Czy chcesz zainstalowac ją teraz ?'
			);

			if (userAgreedToUpdateApp)
				this._pwaUpdates
					.activateUpdate()
					.then(() => document.location.reload());
		});
		this._pwaUpdates.checkForUpdate();
	}
}
