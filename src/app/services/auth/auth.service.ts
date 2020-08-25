import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { BehaviorSubject, from, Subject } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(
		private readonly _afAuth: AngularFireAuth,
		private readonly _user: UserService
	) {}

	private readonly _onLogin$ = new Subject<User>();
	private readonly _onLogout$ = new Subject<null>();

	/**
	 * Logs in with Google account.
	 */

	async loginWithGoogle() {
		const provider = new auth.GoogleAuthProvider();
		const credentials = await this._afAuth.auth.signInWithPopup(provider);
		this._onLogin$.next(credentials.user);
		return credentials;
	}

	/**
	 * Logs out currently logged in user.
	 */

	async logout(): Promise<void> {
		await this._afAuth.auth.signOut();
		this._onLogout$.next(null);
	}

	/**
	 * If you need to do something immediately after login occurs, use this observable, rather than just awaiting login function.
	 */

	get onLogin$() {
		return this._onLogin$.pipe(
			switchMap(user => from(this._user.informAppIfUserDataIsAvailable(user)))
		);
	}

	/**
	 * If you need to do something immediately after logout occurs, use this observable, rather than just awaiting login function.
	 */

	get onLogout$() {
		return this._onLogout$.pipe(
			switchMap(() => from(this._user.informAppIfUserDataIsAvailable(null))),
			mapTo(null)
		);
	}
}
