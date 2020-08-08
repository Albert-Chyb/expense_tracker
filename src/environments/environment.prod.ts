export const environment = {
	production: true,
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
		enabled: false,
		firestore: {
			host: 'localhost:8080',
			ssl: false,
		},
	},
};
