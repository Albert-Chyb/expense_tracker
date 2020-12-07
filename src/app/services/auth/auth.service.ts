import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { from, Subject } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';
import { destroyCache } from 'src/app/common/cash/cashable';
import { UserService } from 'src/app/services/user/user.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(
		private readonly _afAuth: AngularFireAuth,
		private readonly _user: UserService
	) {
		this._afAuth.authState.subscribe(user => {
			if (!user) destroyCache();
		});
	}

	private readonly _onLogin$ = new Subject<User>();
	private readonly _onLogout$ = new Subject<null>();

	/**
	 * Logs in with Google account.
	 */

	async loginWithGoogle() {
		const provider = new auth.GoogleAuthProvider();
		const credentials = await this._afAuth.signInWithPopup(provider);
		this._onLogin$.next(credentials.user);
		return credentials;
	}

	/**
	 * Logs out currently logged in user.
	 */

	async logout(): Promise<void> {
		await this._afAuth.signOut();
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
