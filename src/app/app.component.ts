import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	/*
		! Do not remove unused dependencies from constructor.
		! Theirs constructors may contain logic that is required as soon as possible.
		! This is why, they have to be initialized here.
	*/
	constructor(private readonly _user: UserService) {}

	ngOnInit() {
		registerLocaleData(localePL);

		// Change to local cloud functions in development environment.
		if (environment.firebaseEmulators.enabled)
			firebase.functions().useFunctionsEmulator('http://localhost:5001');
	}
}
