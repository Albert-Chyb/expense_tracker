import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private readonly _afAuth: AngularFireAuth) {}

	/**
	 * Logs in with google account.
	 * This is only first part of creating account.
	 * Remember to complete creating account by creating associated with user's ID,
	 * data in database.
	 */

	loginWithGoogle() {
		const provider = new auth.GoogleAuthProvider();
		return this._afAuth.auth.signInWithPopup(provider);
	}

	/**
	 * Logs out currently logged in user.
	 */

	logout() {
		return this._afAuth.auth.signOut();
	}
}
