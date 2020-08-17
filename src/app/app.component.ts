import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';

import { FormErrorsService } from './services/form-errors/form-errors.service';
import { UserService } from './services/user/user.service';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	/*
		! Do not remove unused dependencies from constructor.
		! Theirs constructor may contain logic that is required as soon as possible.
		! This is why, they have to be initialized here.
	*/
	constructor(
		private readonly _user: UserService,
		private readonly _formErrors: FormErrorsService,
		private readonly _afFunctions: AngularFireFunctions
	) {}

	ngOnInit() {
		registerLocaleData(localePL);

		// Change to local cloud functions in development environment.
		if (environment.firebaseEmulators.enabled) {
			firebase.functions().useFunctionsEmulator('http://localhost:5001');

			const fn = this._afFunctions.httpsCallable('autoEndPeriodOnDayEnd');
			setInterval(() => {
				fn({}).subscribe(console.log);
			}, 5000);
		}

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
}
