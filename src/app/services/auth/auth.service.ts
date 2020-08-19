import { UserService } from 'src/app/services/user/user.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(
		private readonly _afAuth: AngularFireAuth,
		private readonly _user: UserService
	) {}

	/**
	 * Logs in with google account.
	 */

	async loginWithGoogle() {
		const provider = new auth.GoogleAuthProvider();
		const credentials = await this._afAuth.auth.signInWithPopup(provider);
		await this._user.determineIfUserCreatedData(credentials.user);
		return credentials;
	}

	/**
	 * Logs out currently logged in user.
	 */

	logout() {
		return this._afAuth.auth.signOut();
	}
}
