// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	firebase: {
		apiKey: 'AIzaSyCpR6v0eL39w_su1z_4MCoo8eZ8Wfylz8c',
		authDomain: 'expense-tracker-bf5ac.firebaseapp.com',
		databaseURL: 'https://expense-tracker-bf5ac.firebaseio.com',
		projectId: 'expense-tracker-bf5ac',
		storageBucket: 'expense-tracker-bf5ac.appspot.com',
		messagingSenderId: '545457397863',
		appId: '1:545457397863:web:5b15a4c0c235cf7b7db4c2',
		measurementId: 'G-S75GWZ487R',
	},
	firebaseEmulators: {
		enabled: true,
		firestore: {
			host: 'localhost:8080',
			ssl: false,
		},
	},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
